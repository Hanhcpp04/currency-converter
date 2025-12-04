package com.example.demo.dtos;

import lombok.Data;
import java.util.Map;
@Data


public class RateRespone {
    private String base;
    private Map<String, Double> rates;
}
