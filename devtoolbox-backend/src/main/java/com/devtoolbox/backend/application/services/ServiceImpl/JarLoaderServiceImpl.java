package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.JarLoaderService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.net.URL;
import java.net.URLClassLoader;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.Map;
import java.util.jar.JarFile;

@Service
public class JarLoaderServiceImpl implements JarLoaderService {

    @Autowired
    private ConfigurableApplicationContext applicationContext;

    @Value("${app.plugins.runtime-loading-enabled:false}")
    private boolean runtimeLoadingEnabled;

    // Lưu trữ các service đã nạp
    private final Map<String, Object> dynamicServices = new ConcurrentHashMap<>();
    private final List<URLClassLoader> pluginClassLoaders = new CopyOnWriteArrayList<>();

    @Override
    public void loadJarFile(MultipartFile jarFile) throws Exception {
        if (!runtimeLoadingEnabled) {
            throw new IllegalStateException(
                "Runtime plugin loading is disabled. Set PLUGIN_RUNTIME_LOADING_ENABLED=true only for trusted plugins.");
        }

        String originalFilename = jarFile.getOriginalFilename();
        if (jarFile.isEmpty() || originalFilename == null || !originalFilename.toLowerCase().endsWith(".jar")) {
            throw new IllegalArgumentException("Invalid file: " + originalFilename);
        }

        String safeFilename = Paths.get(originalFilename).getFileName().toString();
        Path jarDirectory = Paths.get("uploaded-jars").toAbsolutePath().normalize();
        Path path = jarDirectory.resolve(safeFilename).normalize();
        if (!path.startsWith(jarDirectory)) {
            throw new IllegalArgumentException("Invalid JAR filename");
        }

        Files.createDirectories(jarDirectory);
        Files.write(path, jarFile.getBytes());

        try (java.util.jar.JarFile ignored = new java.util.jar.JarFile(path.toFile())) {
            // Opening the archive verifies that the upload is a readable JAR.
        } catch (Exception ex) {
            Files.deleteIfExists(path);
            throw new IllegalArgumentException("Uploaded file is not a valid JAR", ex);
        }

        System.out.println("Jar file saved to: " + path.toAbsolutePath());

        URLClassLoader classLoader = createPluginClassLoader(path);
        pluginClassLoaders.add(classLoader);
        registerBeansFromJar(path, classLoader);
    }

    private URLClassLoader createPluginClassLoader(Path jarPath) throws Exception {
        Path runtimeDirectory = jarPath.getParent()
                .resolve(".runtime")
                .resolve(jarPath.getFileName().toString().replaceFirst("(?i)\\.jar$", ""));
        Path classesDirectory = runtimeDirectory.resolve("classes");
        Path librariesDirectory = runtimeDirectory.resolve("lib");
        Files.createDirectories(classesDirectory);
        Files.createDirectories(librariesDirectory);

        List<URL> classpath = new ArrayList<>();
        boolean fatJar = false;
        try (JarFile jarFile = new JarFile(jarPath.toFile())) {
            for (var entries = jarFile.entries(); entries.hasMoreElements();) {
                var entry = entries.nextElement();
                String entryName = entry.getName();
                if (entry.isDirectory()) {
                    continue;
                }

                Path target = null;
                if (entryName.startsWith("BOOT-INF/classes/")) {
                    fatJar = true;
                    target = classesDirectory.resolve(entryName.substring("BOOT-INF/classes/".length())).normalize();
                    if (!target.startsWith(classesDirectory)) {
                        throw new IllegalArgumentException("Unsafe entry in JAR: " + entryName);
                    }
                } else if (entryName.startsWith("BOOT-INF/lib/") && entryName.endsWith(".jar")) {
                    fatJar = true;
                    target = librariesDirectory.resolve(Paths.get(entryName).getFileName().toString()).normalize();
                }

                if (target != null) {
                    Files.createDirectories(target.getParent());
                    try (var input = jarFile.getInputStream(entry)) {
                        Files.copy(input, target, StandardCopyOption.REPLACE_EXISTING);
                    }
                }
            }
        }

        if (fatJar) {
            classpath.add(classesDirectory.toUri().toURL());
            try (var libraries = Files.list(librariesDirectory)) {
                libraries.filter(file -> file.getFileName().toString().endsWith(".jar"))
                        .map(this::toUrl)
                        .forEach(classpath::add);
            }
        } else {
            classpath.add(jarPath.toUri().toURL());
        }

        return new URLClassLoader(classpath.toArray(new URL[0]), getClass().getClassLoader());
    }

    private URL toUrl(Path path) {
        try {
            return path.toUri().toURL();
        } catch (Exception ex) {
            throw new IllegalArgumentException("Invalid plugin classpath entry: " + path, ex);
        }
    }

    private void registerBeansFromJar(Path jarPath, ClassLoader classLoader) throws Exception {
        List<Class<?>> classes = getClassesFromJar(jarPath, classLoader);
        for (Class<?> clazz : classes) {
            if (clazz.isAnnotationPresent(org.springframework.stereotype.Service.class)
                    || clazz.isAnnotationPresent(org.springframework.stereotype.Component.class)) {
                Object bean = applicationContext.getAutowireCapableBeanFactory().createBean(clazz);
                if (!applicationContext.containsBean(clazz.getName())) {
                    applicationContext.getBeanFactory().registerSingleton(clazz.getName(), bean);
                }
                dynamicServices.put(clazz.getSimpleName(), bean);
            }
        }
    }

    private List<Class<?>> getClassesFromJar(Path jarPath, ClassLoader classLoader) throws Exception {
        List<Class<?>> classes = new ArrayList<>();
        try (JarFile jarFile = new JarFile(jarPath.toFile())) {
            jarFile.stream()
                .filter(entry -> entry.getName().startsWith("BOOT-INF/classes/") && entry.getName().endsWith(".class"))
                .forEach(entry -> {
                    String className = entry.getName()
                        .replace("BOOT-INF/classes/", "")
                        .replace("/", ".")
                        .replace(".class", "");

                    if (className.startsWith("com.")) {
                        try {
                            classes.add(Class.forName(className, true, classLoader));
                        } catch (ReflectiveOperationException | LinkageError ex) {
                            throw new IllegalStateException("Failed to load plugin class: " + className, ex);
                        }
                    }
                });
        }
        return classes;
    }

    public Map<String, Object> getDynamicServices() {
        return dynamicServices;
    }

    // @PostConstruct
    // public void initialize() {
    //     try {
    //         String jarDir = "uploaded-jars/";
    //         File folder = new File(jarDir);
    //         if (!folder.exists() || !folder.isDirectory()) {
    //             System.out.println("Jar directory does not exist. Creating directory: " + jarDir);
    //             folder.mkdirs();
    //             return;
    //         }

    //         File[] jarFiles = folder.listFiles((dir, name) -> name.endsWith(".jar"));
    //         if (jarFiles == null || jarFiles.length == 0) {
    //             System.out.println("No jar files found in directory: " + jarDir);
    //             return;
    //         }

    //         for (File jarFile : jarFiles) {
    //             System.out.println("Found jar file: " + jarFile.getName());
    //             loadJarFile(jarFile);
    //         }
    //     } catch (Exception e) {
    //         System.err.println("Error during initialization: " + e.getMessage());
    //         e.printStackTrace();
    //     }
    // }

    // // Overloaded method to load jar from File object
    // public void loadJarFile(File jarFile) throws Exception {
    //     String jarFilePath = jarFile.getAbsolutePath();
    //     System.out.println("Loading jar file: " + jarFilePath);

    //     // Nạp file .jar vào runtime
    //     loadJarIntoRuntime(jarFilePath);

    //     // Đăng ký các bean từ file .jar
    //     registerBeansFromJar(jarFilePath);
    // }
}
