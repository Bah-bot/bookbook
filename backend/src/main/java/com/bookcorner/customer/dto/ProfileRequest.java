package com.bookcorner.customer.dto;

import lombok.Data;

@Data
public class ProfileRequest {

    private String firstName;
    private String lastName;
    private String phone;
    private String address;
    private String city;
    private String country;
}
