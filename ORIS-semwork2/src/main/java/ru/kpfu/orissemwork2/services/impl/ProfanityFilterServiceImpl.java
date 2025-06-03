package ru.kpfu.orissemwork2.services.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.client.*;
import org.springframework.web.server.ResponseStatusException;
import ru.kpfu.orissemwork2.services.ProfanityFilterService;

@Service
public class ProfanityFilterServiceImpl implements ProfanityFilterService {
    @Autowired
    private RestTemplate restTemplate;

    @Value("${profanity.filter.service.url}")
    String serviceUrl;

    public boolean containsProfanity(String text) {
        try {
            String url = serviceUrl + text;
            String response = restTemplate.getForObject(url, String.class);
            return Boolean.parseBoolean(response);
        } catch (ResourceAccessException e) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "Profanity service unavailable", e);
        } catch (HttpClientErrorException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid request to profanity service", e);
        } catch (HttpServerErrorException e) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Profanity service error", e);
        } catch (RestClientException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Failed to check profanity", e);
        }
    }
}