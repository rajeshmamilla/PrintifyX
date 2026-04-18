package com.printifyx.backend.service;

import com.printifyx.backend.entity.User;
import com.printifyx.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    public CustomOAuth2UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        
        try {
            return processOAuth2User(userRequest, oAuth2User);
        } catch (Exception ex) {
            throw new OAuth2AuthenticationException(ex.getMessage());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest userRequest, OAuth2User oAuth2User) {
        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String providerId = (String) attributes.get("sub"); // Google's unique user ID
        String pictureUrl = (String) attributes.get("picture");
        
        Optional<User> userOptional = userRepository.findByEmail(email);
        User user;
        
        if (userOptional.isPresent()) {
            user = userOptional.get();
            // Link account if not already linked
            if (user.getProviderId() == null) {
                user.setProvider("GOOGLE");
                user.setProviderId(providerId);
                user.setPictureUrl(pictureUrl);
                userRepository.save(user);
            }
        } else {
            // New user registration via Google
            user = new User();
            user.setEmail(email);
            user.setProvider("GOOGLE");
            user.setProviderId(providerId);
            user.setPictureUrl(pictureUrl);
            user.setRole("USER");
            // Password remains null for Google users
            userRepository.save(user);
        }
        
        return oAuth2User;
    }
}
