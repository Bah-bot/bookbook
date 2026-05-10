package com.bookcorner.config;

import com.bookcorner.catalog.entity.Category;
import com.bookcorner.catalog.entity.Product;
import com.bookcorner.catalog.repository.CategoryRepository;
import com.bookcorner.catalog.repository.ProductRepository;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.inventory.entity.Inventory;
import com.bookcorner.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    @Override
    public void run(String... args) {

        // Ne pas réinsérer si les données existent déjà
        if (categoryRepository.count() > 0) return;

        // ========================
        // CATEGORIES
        // ========================
        Category roman = categoryRepository.save(Category.builder()
                .name("Roman").description("Romans et fiction").build());

        Category science = categoryRepository.save(Category.builder()
                .name("Science").description("Livres scientifiques").build());

        Category dev = categoryRepository.save(Category.builder()
                .name("Développement").description("Programmation et tech").build());

        Category histoire = categoryRepository.save(Category.builder()
                .name("Histoire").description("Livres historiques").build());

        // ========================
        // PRODUITS (LIVRES)
        // ========================
        Product p1 = saveProduct("Le Petit Prince", "Antoine de Saint-Exupéry",
                "Un classique de la littérature française.", 9.99,
                "https://covers.openlibrary.org/b/isbn/9782070612758-L.jpg",
                "9782070612758", roman);

        Product p2 = saveProduct("1984", "George Orwell",
                "Un roman dystopique sur la surveillance totale.", 12.50,
                "https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg",
                "9780451524935", roman);

        Product p3 = saveProduct("Une brève histoire du temps", "Stephen Hawking",
                "La cosmologie expliquée au grand public.", 15.00,
                "https://covers.openlibrary.org/b/isbn/9780553380163-L.jpg",
                "9780553380163", science);

        Product p4 = saveProduct("Clean Code", "Robert C. Martin",
                "Les bonnes pratiques du développement logiciel.", 35.00,
                "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg",
                "9780132350884", dev);

        Product p5 = saveProduct("Spring Boot in Action", "Craig Walls",
                "Guide complet pour Spring Boot.", 42.00,
                "https://covers.openlibrary.org/b/isbn/9781617292545-L.jpg",
                "9781617292545", dev);

        Product p6 = saveProduct("Sapiens", "Yuval Noah Harari",
                "Une brève histoire de l'humanité.", 18.00,
                "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
                "9780062316097", histoire);

        Product p7 = saveProduct("L'Étranger", "Albert Camus",
                "Un roman philosophique de l'absurde.", 8.50,
                "https://covers.openlibrary.org/b/isbn/9782070360024-L.jpg",
                "9782070360024", roman);

        Product p8 = saveProduct("Design Patterns", "Gang of Four",
                "Les patrons de conception incontournables.", 45.00,
                "https://covers.openlibrary.org/b/isbn/9780201633610-L.jpg",
                "9780201633610", dev);

        // ========================
        // STOCK
        // ========================
        saveStock(p1, 50);
        saveStock(p2, 30);
        saveStock(p3, 20);
        saveStock(p4, 15);
        saveStock(p5, 10);
        saveStock(p6, 25);
        saveStock(p7, 40);
        saveStock(p8, 8);

        // ========================
        // UTILISATEURS DE TEST
        // ========================
        userRepository.save(User.builder()
                .email("admin@bookcorner.com")
                .password("admin123")
                .role("ADMIN")
                .build());

        userRepository.save(User.builder()
                .email("user@bookcorner.com")
                .password("user123")
                .role("USER")
                .build());

        System.out.println("✅ Données de test insérées avec succès !");
    }

    private Product saveProduct(String title, String author, String description,
                                Double price, String imageUrl, String isbn,
                                Category category) {
        return productRepository.save(Product.builder()
                .title(title)
                .author(author)
                .description(description)
                .price(price)
                .imageUrl(imageUrl)
                .isbn(isbn)
                .category(category)
                .build());
    }

    private void saveStock(Product product, int quantity) {
        inventoryRepository.save(Inventory.builder()
                .product(product)
                .quantity(quantity)
                .build());
    }
}