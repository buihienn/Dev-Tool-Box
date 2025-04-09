package com.devtoolbox.backend.application.services;

import java.util.List;

public interface UlidService {
    List<String> generateUlids(int quantity);
}