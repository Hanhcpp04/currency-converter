package com.example.demo.dtos;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConversionResponse {
    private String from;
    private String to;
    private Double amount;
    private Double rate;
    private Double convertedAmount;
    private List<String> currencyCodes;
}
