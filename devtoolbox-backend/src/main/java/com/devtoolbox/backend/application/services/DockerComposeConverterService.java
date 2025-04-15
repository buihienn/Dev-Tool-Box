package com.devtoolbox.backend.application.services;

public interface DockerComposeConverterService {
    String convertToCompose(String dockerRunCommand) throws Exception;
}
