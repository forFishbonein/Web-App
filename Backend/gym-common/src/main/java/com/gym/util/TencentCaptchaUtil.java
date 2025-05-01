package com.gym.util;

import lombok.Data;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.tencentcloudapi.captcha.v20190722.CaptchaClient;
import com.tencentcloudapi.captcha.v20190722.models.DescribeCaptchaResultRequest;
import com.tencentcloudapi.captcha.v20190722.models.DescribeCaptchaResultResponse;
import com.tencentcloudapi.common.Credential;
import com.tencentcloudapi.common.exception.TencentCloudSDKException;
import com.tencentcloudapi.common.profile.ClientProfile;
import com.tencentcloudapi.common.profile.HttpProfile;

@Slf4j
@Data
@Component
public class TencentCaptchaUtil {
    // if enabled is false, skip all verification
    @Value("${tencent.captcha.enabled:true}")
    private boolean enabled;

    @Value("${tencent.captcha.secretId}")
    private String secretId;

    @Value("${tencent.captcha.secretKey}")
    private String secretKey;

    @Value("${tencent.captcha.captchaAppId}")
    private Long captchaAppId;

    @Value("${tencent.captcha.appSecretKey}")
    private String appSecretKey;

    /**
     * Verify Tencent sliding puzzle captcha
     *
     * @param ticket  Ticket returned by the frontend
     * @param randStr Randstr returned by the frontend
     * @param userIp  User IP
     * @return Returns true if verification is successful, otherwise false
     */
    public boolean verifyCaptcha(String ticket, String randStr, String userIp) {

        // —— First case: Skip verification if the global switch is off or configuration is incomplete ——
        if (!enabled) {
            log.warn("Tencent captcha verification has been disabled, skipping verification");
            return true;
        }
        if (StringUtils.isAnyBlank(secretId, secretKey, appSecretKey)) {
            log.warn("Tencent captcha configuration is incomplete, skipping verification");
            return true;
        }

        try {
            // 1. Instantiate a credential object, passing in Tencent Cloud account SecretId and SecretKey
            Credential cred = new Credential(secretId, secretKey);

            // 2. Instantiate an HTTP option, optional, can be configured if there is a proxy or special requirements
            HttpProfile httpProfile = new HttpProfile();
            httpProfile.setEndpoint("captcha.tencentcloudapi.com"); // Specify the endpoint

            // 3. Instantiate a client option, optional
            ClientProfile clientProfile = new ClientProfile();
            clientProfile.setHttpProfile(httpProfile);

            // 4. Instantiate a CaptchaClient
            CaptchaClient client = new CaptchaClient(cred, "", clientProfile);

            // 5. Instantiate a request object
            DescribeCaptchaResultRequest req = new DescribeCaptchaResultRequest();
            // Required parameters, set according to the official documentation
            req.setCaptchaType(9L);         // 9 represents sliding puzzle captcha
            req.setTicket(ticket);
            req.setUserIp("2001:630:d0:5004:d93d:61f8:30af:b45e");
            req.setRandstr(randStr);
            req.setCaptchaAppId(captchaAppId);
            req.setAppSecretKey(appSecretKey);
            // Optional parameters, can be set if needed
            // req.setBusinessId(123L);
            // req.setSceneId(1001L);
            // ...

            // 6. Call the API and get the response
            DescribeCaptchaResultResponse resp = client.DescribeCaptchaResult(req);

            // 7. Get the verification status from resp
            // When resp.getCaptchaCode() == 1, it indicates success
            long code = resp.getCaptchaCode();
            String msg = resp.getCaptchaMsg();
            log.info("Captcha verify result: code={}, msg={}", code, msg);

            // code == 1 indicates verification success
            return (code == 1);
        } catch (TencentCloudSDKException e) {
            // Log the exception if it occurs
            log.error("Captcha verify exception: {}", e.toString());
            return false;
        }
    }
}