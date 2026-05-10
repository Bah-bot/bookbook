package com.bookcorner.billing.service;

import com.bookcorner.billing.dto.OrderResponse;
import com.bookcorner.billing.dto.OrderItemResponse;
import com.bookcorner.billing.entity.Order;
import com.bookcorner.billing.entity.OrderItem;
import com.bookcorner.billing.repository.OrderRepository;
import com.bookcorner.billing.repository.OrderItemRepository;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import com.bookcorner.exception.StockUnavailableException;
import com.bookcorner.inventory.service.InventoryService;
import com.bookcorner.shopping.entity.Cart;
import com.bookcorner.shopping.entity.CartItem;
import com.bookcorner.shopping.repository.CartRepository;
import com.bookcorner.shopping.service.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;
    private final CartService cartService;

    @Transactional
    public OrderResponse checkout(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + userId));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Panier non trouvé"));

        if (cart.getItems().isEmpty()) {
            throw new StockUnavailableException("Le panier est vide");
        }

        // Vérifier le stock pour chaque article
        for (CartItem item : cart.getItems()) {
            if (!inventoryService.isAvailable(item.getProduct().getId(), item.getQuantity())) {
                throw new StockUnavailableException("Stock insuffisant pour : " + item.getProduct().getTitle());
            }
        }

        // Créer la commande
        Order order = Order.builder()
                .user(user)
                .createdAt(LocalDateTime.now())
                .total(cart.getTotal())
                .status("PENDING")
                .build();

        order = orderRepository.save(order);

        // Créer les lignes de commande
        List<OrderItem> orderItems = new ArrayList<>();
        for (CartItem cartItem : cart.getItems()) {
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(cartItem.getProduct())
                    .quantity(cartItem.getQuantity())
                    .unitPrice(cartItem.getUnitPrice())
                    .build();
            orderItems.add(orderItemRepository.save(orderItem));

            // Décrémenter le stock
            inventoryService.decreaseStock(cartItem.getProduct().getId(), cartItem.getQuantity());
        }

        order.setItems(orderItems);

        // Vider le panier
        cartService.clearCart(userId);

        return toResponse(order);
    }

    public List<OrderResponse> getOrdersByUser(Long userId) {
        return orderRepository.findByUserId(userId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private OrderResponse toResponse(Order order) {
        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> OrderItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProduct().getTitle())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice() * item.getQuantity())
                        .build())
                .toList();

        return OrderResponse.builder()
                .id(order.getId())
                .createdAt(order.getCreatedAt())
                .total(order.getTotal())
                .status(order.getStatus())
                .userId(order.getUser().getId())
                .items(items)
                .build();
    }
}