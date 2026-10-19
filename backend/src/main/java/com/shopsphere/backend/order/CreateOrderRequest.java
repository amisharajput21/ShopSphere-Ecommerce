package com.shopsphere.backend.order;

import java.util.List;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;

public record CreateOrderRequest(
    @NotBlank @Size(min=2, max=100) String customerName,
    @NotBlank @Email String customerEmail,
    @NotBlank @Size(min=8, max=1000) String deliveryAddress,
    @NotEmpty List<@Valid OrderLineRequest> items
) {
    public record OrderLineRequest(@jakarta.validation.constraints.NotNull Long productId,
                                   @jakarta.validation.constraints.Min(1) @jakarta.validation.constraints.Max(99) int quantity) {}
}
