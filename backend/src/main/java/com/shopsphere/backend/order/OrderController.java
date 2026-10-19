package com.shopsphere.backend.order;

import java.util.ArrayList;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.transaction.annotation.Transactional;
import jakarta.validation.Valid;
import com.shopsphere.backend.product.Product;
import com.shopsphere.backend.product.ProductRepository;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final CustomerOrderRepository orders;
    private final ProductRepository products;
    public OrderController(CustomerOrderRepository orders, ProductRepository products) { this.orders=orders; this.products=products; }

    @PostMapping
    @Transactional
    public Map<String, Object> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        int total = 0;
        for (CreateOrderRequest.OrderLineRequest line : request.items()) {
            Product product = products.findById(line.productId()).orElseThrow(() ->
                    new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found: " + line.productId()));
            total = Math.addExact(total, Math.multiplyExact(product.getPrice(), line.quantity()));
        }
        CustomerOrder saved = orders.save(orderWithTotal(request, total));
        return Map.of("message", "Order saved successfully", "orderId", "SS-" + saved.getId(),
                "totalAmount", saved.getTotalAmount(), "createdAt", saved.getCreatedAt());
    }
    private CustomerOrder orderWithTotal(CreateOrderRequest request, int total) {
        CustomerOrder order = new CustomerOrder(request.customerName().trim(), request.customerEmail().trim(), request.deliveryAddress().trim(), total);
        for (CreateOrderRequest.OrderLineRequest line : request.items()) {
            Product product = products.findById(line.productId()).orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Product not found"));
            order.addItem(new OrderItem(product.getId(), product.getName(), product.getPrice(), line.quantity()));
        }
        return order;
    }
}
