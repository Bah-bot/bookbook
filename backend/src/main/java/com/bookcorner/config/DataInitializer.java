package com.bookcorner.config;

import com.bookcorner.catalog.entity.Category;
import com.bookcorner.catalog.entity.Product;
import com.bookcorner.catalog.entity.Review;
import com.bookcorner.catalog.repository.CategoryRepository;
import com.bookcorner.catalog.repository.ProductRepository;
import com.bookcorner.catalog.repository.ReviewRepository;
import com.bookcorner.customer.entity.User;
import com.bookcorner.customer.repository.UserRepository;
import com.bookcorner.inventory.entity.Inventory;
import com.bookcorner.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public void run(String... args) {

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
        userRepository.save(User.builder()
                .email("sara@bookcorner.com")
                .password("sara123")
                .role("USER")
                .build());

        userRepository.save(User.builder()
                .email("karim@bookcorner.com")
                .password("karim123")
                .role("USER")
                .build());

        userRepository.save(User.builder()
                .email("nadia@bookcorner.com")
                .password("nadia123")
                .role("USER")
                .build());

        userRepository.save(User.builder()
                .email("youssef@bookcorner.com")
                .password("youssef123")
                .role("USER")
                .build());

        // ========================
        // REVIEWS
        // ========================

        // Le Petit Prince
        saveReview(p1, "sara.m", "lu ce livre à 10 ans et encore aujourd'hui il me touche autant.. un chef d'oeuvre", 5, -120);
        saveReview(p1, "karim92", "bon livre mais un peu court à mon goût. le message est beau quand meme", 3, -45);
        saveReview(p1, "nadia.read", "je l'ai offert à ma fille, elle a adoré. les illustrations sont magnifiques", 5, -200);
        saveReview(p1, "med_books", "classique obligatoire. relu 3 fois et à chaque fois je decouvre qqch de nouveau", 4, -15);

        // 1984
        saveReview(p2, "youssef.lit", "terrifiant tellement c'est proche de la réalité actuelle. Orwell avait tout vu", 5, -90);
        saveReview(p2, "layla_reads", "un peu long au debut mais après impossible de lacher le livre sérieux", 4, -30);
        saveReview(p2, "amine.b", "dystopie parfaite. big brother is watching you 👀 donne la chair de poule", 5, -180);
        saveReview(p2, "fatima.z", "bien écrit mais vraiment déprimant lol. pas pour tout le monde", 3, -60);

        // Une brève histoire du temps
        saveReview(p3, "physics_fan", "hawking explique des trucs super complexes d'une façon simple, respect total", 5, -75);
        saveReview(p3, "rachid.m", "j'ai pas tout compris mais c'était fascinant quand meme haha", 3, -20);
        saveReview(p3, "salma.k", "pour quelqu'un qui aime la science c'est parfait. faut juste être patient", 4, -140);

        // Clean Code
        saveReview(p4, "dev.maroc", "obligatoire pour tout développeur sérieux point final", 5, -50);
        saveReview(p4, "coding_hamza", "les exemples sont en java ce qui est bien. certaines règles sont un peu extrêmes mais globalement excellent", 4, -25);
        saveReview(p4, "issam_dev", "mon chef me l'a recommandé et il avait raison. code quality changed completely", 5, -95);
        saveReview(p4, "zineb.code", "bon livre mais un peu répétitif vers la fin. les 2/3 premiers chapitres sont les meilleurs", 3, -10);

        // Spring Boot in Action
        saveReview(p5, "java_nabil", "exactement ce qu'il me fallait pour apprendre spring boot. exemples pratiques et clairs", 5, -40);
        saveReview(p5, "sofiane.dev", "bien pour les débutants. par contre certaines parties sont un peu outdated", 3, -85);
        saveReview(p5, "backend_aya", "j'ai construit mon premier projet spring grâce à ce livre. vraiment recommandé", 4, -30);

        // Sapiens
        saveReview(p6, "histoire.fan", "ce livre m'a changé la façon de voir le monde, littéralement. incroyable", 5, -200);
        saveReview(p6, "omar.reads", "passionnant du début à la fin. harari sait raconter l'histoire comme personne", 5, -65);
        saveReview(p6, "kenza.m", "très intéressant mais parfois harari force un peu ses conclusions. 4/5 quand meme", 4, -110);
        saveReview(p6, "fouad.lit", "trop long selon moi mais les idées sont originales et bien argumentées", 3, -35);

        // L'Étranger
        saveReview(p7, "camus.lover", "court mais tellement dense. meursault est un personnage fascinant et dérangeant", 5, -150);
        saveReview(p7, "rim.b", "lu pour le bac et j'ai vraiment accroché contrairement aux autres livres scolaires lol", 4, -80);
        saveReview(p7, "philosophe_amateur", "l'absurde expliqué par l'action, pas par les mots. génie pur", 5, -55);
        saveReview(p7, "mehdi.reads", "honnêtement j'ai pas trop aimé mais je comprends pourquoi c'est un classique", 2, -20);

        // Design Patterns
        saveReview(p8, "senior.dev", "la bible des design patterns. indispensable même si les exemples sont un peu vieux", 5, -300);
        saveReview(p8, "karima.code", "dense et technique mais si vous bossez en POO c'est une référence incontournable", 4, -120);
        saveReview(p8, "anas.arch", "pas pour les débutants attention. faut avoir de l'expérience pour vraiment apprécier", 3, -45);

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

    private void saveReview(Product product, String username, String comment, int rating, int daysAgoMinutes) {
        Review review = new Review();
        review.setProductId(product.getId());
        review.setUsername(username);
        review.setComment(comment);
        review.setRating(rating);
        review.setCreatedAt(LocalDateTime.now().plusMinutes(daysAgoMinutes));
        reviewRepository.save(review);
    }
}