package com.example.demo.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.http.ResponseEntity;

import com.example.demo.service.CurrencyService;
import com.example.demo.dtos.ConversionResponse;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequestMapping("/api/v1/currency")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CurrencyController {
    private final CurrencyService currencyService;

    @GetMapping("/convert")
    public ResponseEntity<ConversionResponse> convertCurrency(
        @RequestParam String from,
        @RequestParam String to,
        @RequestParam Double amount){
            System.out.printf("RUNNING: Convert request received: from %s to %s amount %.2f%n", from, to, amount);
            ConversionResponse result = currencyService.convert(from, to, amount);
            if(result != null){
                return ResponseEntity.ok(result);
            } else {
                return ResponseEntity.badRequest().build();
            }
        }
}