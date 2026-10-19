package com.shopsphere.backend.order;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) private Long id;
    private Long productId;
    private String productName;
    private int unitPrice;
    private int quantity;
    @ManyToOne(fetch = FetchType.LAZY) @JoinColumn(name = "order_id") private CustomerOrder order;
    protected OrderItem() {}
    public OrderItem(Long productId, String productName, int unitPrice, int quantity) {
        this.productId=productId; this.productName=productName; this.unitPrice=unitPrice; this.quantity=quantity;
    }
    void setOrder(CustomerOrder order){this.order=order;}
}
