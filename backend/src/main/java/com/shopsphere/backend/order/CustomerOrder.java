package com.shopsphere.backend.order;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "customer_orders")
public class CustomerOrder {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private String customerName;
    private String customerEmail;
    @jakarta.persistence.Column(length = 1000) private String deliveryAddress;
    private int totalAmount;
    private LocalDateTime createdAt;
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> items = new ArrayList<>();

    protected CustomerOrder() {}
    public CustomerOrder(String customerName, String customerEmail, String deliveryAddress, int totalAmount) {
        this.customerName=customerName; this.customerEmail=customerEmail; this.deliveryAddress=deliveryAddress;
        this.totalAmount=totalAmount; this.createdAt=LocalDateTime.now();
    }
    public void addItem(OrderItem item) { items.add(item); item.setOrder(this); }
    public Long getId(){return id;} public String getCustomerName(){return customerName;}
    public int getTotalAmount(){return totalAmount;} public LocalDateTime getCreatedAt(){return createdAt;}
    public List<OrderItem> getItems(){return items;}
}
