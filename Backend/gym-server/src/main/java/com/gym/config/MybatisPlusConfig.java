package com.gym.config;

import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

// This class is a Spring Boot configuration class used to configure MyBatis-Plus interceptors. Specifically:
//
// @Configuration annotation: Indicates that this is a configuration class, which will be loaded by the Spring container during application startup.
// @Bean annotation: Indicates that the object returned by this method (in this case, MybatisPlusInterceptor) will be registered as a Spring Bean and can be automatically injected into other components.
// MybatisPlusInterceptor: This is an interceptor provided by MyBatis-Plus, which can include multiple inner interceptors to extend functionality.
// PaginationInnerInterceptor: A pagination interceptor used to automatically handle pagination logic when executing SQL.
// OptimisticLockerInnerInterceptor: An optimistic lock interceptor used to implement optimistic locking to prevent concurrent update conflicts.
// Execution timing:
// During the startup of the Spring Boot application, the Spring container will scan and load this configuration class, then execute the `mpInterceptor()` method.
// The returned MybatisPlusInterceptor instance will be registered in the container. This means that the interceptor configuration is completed during application startup,
// and it will automatically take effect during subsequent MyBatis operations.
//
// In practice, you will not directly call or inject this `mpInterceptor` in your business code because it is automatically used by the MyBatis-Plus framework.
// Its purpose is to be automatically retrieved and applied by MyBatis-Plus from the Spring container during SQL operations, thereby enabling features like pagination and optimistic locking.
//
// Optimistic locking requires adding the @Version annotation to the entity class.

@Configuration
public class MybatisPlusConfig {
    @Bean
    public MybatisPlusInterceptor mpInterceptor() {
        // 1. Define the MyBatis-Plus interceptor
        MybatisPlusInterceptor mpInterceptor = new MybatisPlusInterceptor();
        // 2. Add the pagination interceptor
        mpInterceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        // 3. Add the optimistic lock interceptor
        mpInterceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        return mpInterceptor;
    }
}
