package com.bookcorner.shopping.service;

import com.bookcorner.catalog.entity.Product;
import com.bookcorner.catalog.repository.ProductRepository;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.exception.ResourceNotFoundException;
import com.bookcorner.exception.StockUnavailableException;
import com.bookcorner.inventory.service.InventoryService;
import com.bookcorner.shopping.dto.AddToCartRequest;
import com.bookcorner.shopping.dto.CartItemResponse;
import com.bookcorner.shopping.dto.CartResponse;
import com.bookcorner.shopping.entity.Cart;
import com.bookcorner.shopping.entity.CartItem;
import com.bookcorner.shopping.repository.CartItemRepository;
import com.bookcorner.shopping.repository.CartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final InventoryService inventoryService;

    public CartResponse getCartByUser(Long userId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));

        return toResponse(cart);
    }

    @Transactional
    public CartResponse addToCart(Long userId, AddToCartRequest request) {

        // Vérifier la disponibilité du stock
        if (!inventoryService.isAvailable(request.getProductId(), request.getQuantity())) {
            throw new StockUnavailableException("Stock insuffisant pour ce produit");
        }

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Produit non trouvé : " + request.getProductId()));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(userId));

        // Si l'article existe déjà, mettre à jour la quantité
        CartItem item = cartItemRepository
                .findByCartIdAndProductId(cart.getId(), product.getId())
                .orElse(null);

        if (item != null) {
            int newQty = item.getQuantity() + request.getQuantity();
            if (!inventoryService.isAvailable(product.getId(), newQty)) {
                throw new StockUnavailableException("Stock insuffisant. Disponible : "
                        + inventoryService.getStockByProduct(product.getId()).getQuantity());
            }
            item.setQuantity(newQty);
            cartItemRepository.save(item);
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(request.getQuantity())
                    .unitPrice(product.getPrice())
                    .build();
            cart.getItems().add(newItem);
        }

        recalculateTotal(cart);
        cartRepository.save(cart);

        return toResponse(cart);
    }

    @Transactional
    public CartResponse updateItemQuantity(Long userId, Long itemId, Integer quantity) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Panier non trouvé"));

        CartItem item = cartItemRepository.findById(itemId)
                .orElseThrow(() -> new ResourceNotFoundException("Article non trouvé : " + itemId));

        if (!inventoryService.isAvailable(item.getProduct().getId(), quantity)) {
            throw new StockUnavailableException("Stock insuffisant");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);
        recalculateTotal(cart);
        cartRepository.save(cart);

        return toResponse(cart);
    }

    @Transactional
    public CartResponse removeItem(Long userId, Long itemId) {

        Cart cart = cartRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Panier non trouvé"));

        cartItemRepository.deleteById(itemId);
        cart.getItems().removeIf(i -> i.getId().equals(itemId));
        recalculateTotal(cart);
        cartRepository.save(cart);

        return toResponse(cart);
    }

    @Transactional
    public void clearCart(Long userId) {

        cartRepository.findByUserId(userId).ifPresent(cart -> {
            cart.getItems().clear();
            cart.setTotal(0.0);
            cartRepository.save(cart);
        });
    }

    private Cart createEmptyCart(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Utilisateur non trouvé : " + userId));

        Cart cart = Cart.builder()
                .user(user)
                .total(0.0)
                .build();

        return cartRepository.save(cart);
    }

    private void recalculateTotal(Cart cart) {

        double total = cart.getItems().stream()
                .mapToDouble(item -> item.getUnitPrice() * item.getQuantity())
                .sum();
        cart.setTotal(total);
    }

    private CartResponse toResponse(Cart cart) {

        List<CartItemResponse> items = cart.getItems().stream()
                .map(item -> CartItemResponse.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .productTitle(item.getProduct().getTitle())
                        .productImageUrl(item.getProduct().getImageUrl())
                        .quantity(item.getQuantity())
                        .unitPrice(item.getUnitPrice())
                        .subtotal(item.getUnitPrice() * item.getQuantity())
                        .build())
                .toList();

        return CartResponse.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(items)
                .total(cart.getTotal())
                .itemCount(items.size())
                .build();
    }
}
