package com.shopsphere.backend.config;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import com.shopsphere.backend.product.Product;
import com.shopsphere.backend.product.ProductRepository;

@Configuration
public class DataSeeder {
    @Bean CommandLineRunner seedProducts(ProductRepository repository) {
        return args -> {
            if (repository.count() > 0) return;
            repository.saveAll(List.of(
                new Product(1L,"Everyday Sneakers","Clothing",1499,"Bestseller","Easy comfort for wherever the day takes you.","https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&auto=format&fit=crop&q=85"),
                new Product(2L,"The Weekend Backpack","Accessories",1199,"Everyday pick","Room for your essentials and a little extra.","https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&auto=format&fit=crop&q=85"),
                new Product(3L,"Wireless Headphones","Electronics",2499,"Good sound","Your own little world, one playlist at a time.","https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900&auto=format&fit=crop&q=85"),
                new Product(4L,"Classic Wristwatch","Accessories",1899,"","A timeless detail that goes with everything.","https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900&auto=format&fit=crop&q=85"),
                new Product(5L,"Cotton Everyday Tee","Clothing",599,"Easy favourite","Soft, simple and ready for repeat wear.","https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=900&auto=format&fit=crop&q=85"),
                new Product(6L,"Soft Table Lamp","Home",999,"","A warmer glow for your favourite corner.","https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop&q=85"),
                new Product(7L,"Everyday Sunglasses","Accessories",799,"Sunny days","A little shade, a lot of personality.","https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=900&auto=format&fit=crop&q=85"),
                new Product(8L,"Ceramic Coffee Mug","Home",449,"","Make the small daily rituals feel special.","https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&auto=format&fit=crop&q=85")
            ));
        };
    }
}
