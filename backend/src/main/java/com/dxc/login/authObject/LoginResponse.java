package com.dxc.login.authObject;


import com.dxc.login.Role;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class LoginResponse {
    private String token;
    private boolean success;
    private String errorMsg;

    private boolean manager;
    private String name;
    private String email;
}
