package com.shopsphere.backend.product;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Product {
    @Id private Long id;
    private String name;
    private String category;
    private int price;
    private String badge;
    private String description;
    @jakarta.persistence.Column(length = 1000) private String image;

    protected Product() {}
    public Product(Long id, String name, String category, int price, String badge, String description, String image) {
        this.id=id; this.name=name; this.category=category; this.price=price; this.badge=badge;
        this.description=description; this.image=image;
    }
    public Long getId(){return id;} public String getName(){return name;} public String getCategory(){return category;}
    public int getPrice(){return price;} public String getBadge(){return badge;} public String getDescription(){return description;}
    public String getImage(){return image;}
}
