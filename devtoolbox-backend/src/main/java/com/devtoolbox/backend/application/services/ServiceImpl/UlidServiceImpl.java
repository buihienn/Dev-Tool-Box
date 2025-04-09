package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.UlidService;
import de.huxhorn.sulky.ulid.ULID;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

@Service
public class UlidServiceImpl implements UlidService {

    private final ULID ulidGenerator = new ULID();

    @Override
    public List<String> generateUlids(int quantity) {
        return IntStream.range(0, quantity)
                .mapToObj(i -> ulidGenerator.nextULID())
                .collect(Collectors.toList());
    }
}