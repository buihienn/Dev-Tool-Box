package com.devtoolbox.backend.application.services.ServiceImpl;

import com.devtoolbox.backend.application.services.NatoAlphabetService;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NatoAlphabetServiceImpl implements NatoAlphabetService {

    private static final Map<Character, String> NATO_ALPHABET = new HashMap<>();

    static {
        NATO_ALPHABET.put('A', "Alpha");
        NATO_ALPHABET.put('B', "Bravo");
        NATO_ALPHABET.put('C', "Charlie");
        NATO_ALPHABET.put('D', "Delta");
        NATO_ALPHABET.put('E', "Echo");
        NATO_ALPHABET.put('F', "Foxtrot");
        NATO_ALPHABET.put('G', "Golf");
        NATO_ALPHABET.put('H', "Hotel");
        NATO_ALPHABET.put('I', "India");
        NATO_ALPHABET.put('J', "Juliett");
        NATO_ALPHABET.put('K', "Kilo");
        NATO_ALPHABET.put('L', "Lima");
        NATO_ALPHABET.put('M', "Mike");
        NATO_ALPHABET.put('N', "November");
        NATO_ALPHABET.put('O', "Oscar");
        NATO_ALPHABET.put('P', "Papa");
        NATO_ALPHABET.put('Q', "Quebec");
        NATO_ALPHABET.put('R', "Romeo");
        NATO_ALPHABET.put('S', "Sierra");
        NATO_ALPHABET.put('T', "Tango");
        NATO_ALPHABET.put('U', "Uniform");
        NATO_ALPHABET.put('V', "Victor");
        NATO_ALPHABET.put('W', "Whiskey");
        NATO_ALPHABET.put('X', "X-ray");
        NATO_ALPHABET.put('Y', "Yankee");
        NATO_ALPHABET.put('Z', "Zulu");
    }

    @Override
    public String convertToNato(String text) {
        return text.toUpperCase().chars()
                .mapToObj(c -> NATO_ALPHABET.getOrDefault((char) c, String.valueOf((char) c)))
                .collect(Collectors.joining(" "));
    }
}