package com.dxc.login.config;

import com.dxc.login.Role;
import com.dxc.login.jwt.JwtAuthenticationFilter;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authProvider; // provided as bean in ApplicationConfig
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf()
                .disable()
                .authorizeHttpRequests()
                    .requestMatchers(CorsUtils::isPreFlightRequest) // Handle preflight requests
                        .permitAll()
                    .requestMatchers("/auth/**")
                        .permitAll()
                    .requestMatchers("/manager/**")
                        .hasRole(Role.MANAGER.name())
                    .anyRequest()
                        .authenticated()
                    .and()
                .logout()
                    .logoutUrl("/auth/logout")
                    .logoutSuccessHandler(((request, response, authentication) -> {
                        response.setStatus(HttpServletResponse.SC_OK);
                        // this below is very impt
                        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
                    }))
                    .clearAuthentication(true)
                    .and()
                .sessionManagement()
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    .and()
                .authenticationProvider(authProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();

//        corsConfig.addAllowedMethod("*");
        corsConfig.setAllowedMethods(List.of("GET", "POST" , "PUT", "OPTIONS"));
        corsConfig.addAllowedHeader("*");
        corsConfig.setAllowCredentials(true);
        corsConfig.setAllowedOrigins(List.of("http://localhost:3000"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig); // Apply the config to all urls
        source.registerCorsConfiguration("/auth/logout", corsConfig);
        return new CorsFilter(source);
    }
}
