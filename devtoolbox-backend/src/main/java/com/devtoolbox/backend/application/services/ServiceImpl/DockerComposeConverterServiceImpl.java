package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.DockerComposeConverterService;
import org.springframework.stereotype.Service;
import org.yaml.snakeyaml.DumperOptions;
import org.yaml.snakeyaml.Yaml;

import java.util.*;

@Service
public class DockerComposeConverterServiceImpl implements DockerComposeConverterService {

    @Override
    public String convertToCompose(String dockerRunCommand) throws Exception {
        if (dockerRunCommand == null || dockerRunCommand.isEmpty()) {
            throw new IllegalArgumentException("Docker run command is empty.");
        }

        // Tách các thành phần của lệnh docker run
        String[] parts = dockerRunCommand.split("\\s+");
        String image = null;
        String containerName = null;
        String network = null;
        String ports = null;
        String volumes = null;
        String restart = null;
        String logOptions = null;
        List<String> environment = new ArrayList<>();

        for (int i = 0; i < parts.length; i++) {
            switch (parts[i]) {
                case "--name":
                    containerName = parts[++i];
                    break;
                case "-p":
                    ports = parts[++i];
                    break;
                case "-v":
                    volumes = parts[++i];
                    break;
                case "--restart":
                    restart = parts[++i];
                    break;
                case "--log-opt":
                    logOptions = parts[++i].split("=")[1];
                    break;
                case "--network":
                    network = parts[++i];
                    break;
                case "-e":
                    environment.add(parts[++i]);
                    break;
                default:
                    if (i == parts.length - 1) {
                        image = parts[i];
                    }
            }
        }

        // Kiểm tra nếu thiếu image
        if (image == null) {
            throw new IllegalArgumentException("Docker run command must specify an image.");
        }

        // Tạo cấu trúc YAML
        Map<String, Object> compose = new LinkedHashMap<>();
        compose.put("version", "3.9");

        Map<String, Object> services = new LinkedHashMap<>();
        Map<String, Object> serviceDetails = new LinkedHashMap<>();
        serviceDetails.put("image", image);

        if (containerName != null) {
            serviceDetails.put("container_name", containerName);
        }

        if (ports != null) {
            serviceDetails.put("ports", Collections.singletonList(wrapWithQuotes(ports)));
        }

        if (volumes != null) {
            serviceDetails.put("volumes", Collections.singletonList(wrapWithQuotes(volumes)));
        }

        if (restart != null) {
            serviceDetails.put("restart", restart);
        }

        if (logOptions != null) {
            Map<String, Object> logging = new LinkedHashMap<>();
            Map<String, Object> options = new LinkedHashMap<>();
            options.put("max-size", logOptions);
            logging.put("options", options);
            serviceDetails.put("logging", logging);
        }

        if (network != null) {
            serviceDetails.put("networks", Collections.singletonMap(network, new LinkedHashMap<>()));
        }

        if (!environment.isEmpty()) {
            serviceDetails.put("environment", environment);
        }

        services.put(containerName != null ? containerName : image, serviceDetails);
        compose.put("services", services);

        if (network != null) {
            compose.put("networks", Collections.singletonMap(network, new LinkedHashMap<>()));
        }

        // Chuyển đổi cấu trúc YAML thành chuỗi
        DumperOptions options = new DumperOptions();
        options.setPrettyFlow(true);
        options.setDefaultFlowStyle(DumperOptions.FlowStyle.BLOCK);
        Yaml yaml = new Yaml(options);

        return yaml.dump(compose);
    }

    private String wrapWithQuotes(String value) {
        
        return value;
    }
}