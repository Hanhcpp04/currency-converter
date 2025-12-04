package com.example.demo.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.demo.dtos.ConversionResponse;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CurrencyService {
    private final RestTemplate restTemplate;
    private final String apiKey;

    public ConversionResponse convert(String from, String to, Double amount) {
        System.out.println("API Key: '" + apiKey + "'");
        String url = "https://api.exchangeratesapi.io/v1/latest?access_key=" + apiKey;
        
        Map<String, Object> resp = restTemplate.getForObject(url, Map.class);
        if (resp == null || !Boolean.TRUE.equals(resp.get("success"))) {
            throw new RuntimeException("Cannot get exchange rates");
        }

        Map<String, Object> rates = (Map<String, Object>) resp.get("rates");
    
        Double rateFrom = from.equals("EUR") ? 1.0 : ((Number) rates.get(from)).doubleValue();
        Double rateTo = to.equals("EUR") ? 1.0 : ((Number) rates.get(to)).doubleValue();
        
        Double exchangeRate = rateTo / rateFrom;
        Double result = amount * exchangeRate;
        List<String> currencyCodes = new ArrayList<>(rates.keySet());
        return new ConversionResponse(from, to, amount, exchangeRate, result, currencyCodes);
    }

}
