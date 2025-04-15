package com.devtoolbox.backend.application.services;

public interface LoremIpsumService {
    String generate(
        int paragraphs,
        int minSentences,
        int maxSentences,
        int minWords,
        int maxWords,
        boolean startWithLorem,
        boolean asHtml
    );
}