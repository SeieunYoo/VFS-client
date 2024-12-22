import static spark.Spark.*;

import java.sql.*;
import java.util.*;
import com.google.gson.*;

public class ShoppingServer {

    private static final String DB_URL = "jdbc:mysql://localhost:3306/shopping";
    private static final String DB_USER = "root";
    private static final String DB_PASSWORD = "your_password";
    private static final Gson gson = new Gson();

    public static void main(String[] args) {
        port(3001);

        get("/cart", (req, res) -> {
            int userId = Integer.parseInt(req.queryParams("user_id"));
            return gson.toJson(viewCart(userId));
        });

        post("/cart/add", (req, res) -> {
            var body = gson.fromJson(req.body(), CartRequest.class);
            addToCart(body.user_id, body.product_id, body.quantity);
            return gson.toJson(new ResponseMessage("Product added to cart"));
        });

        post("/cart/remove", (req, res) -> {
            var body = gson.fromJson(req.body(), CartRequest.class);
            removeFromCart(body.user_id, body.product_id);
            return gson.toJson(new ResponseMessage("Product removed from cart"));
        });

        post("/order/checkout", (req, res) -> {
            var body = gson.fromJson(req.body(), UserRequest.class);
            int userId = body.user_id;
            try {
                String message = checkout(userId);
                return gson.toJson(new ResponseMessage(message));
            } catch (Exception e) {
                res.status(500);
                return gson.toJson(new ResponseMessage("Failed to place order"));
            }
        });

        get("/orders", (req, res) -> {
            int userId = Integer.parseInt(req.queryParams("user_id"));
            try {
                List<Order> orders = fetchOrders(userId);
                return gson.toJson(orders);
            } catch (Exception e) {
                res.status(500);
                return gson.toJson(new ResponseMessage("Failed to fetch orders"));
            }
        });

   
        post("/reviews", (req, res) -> {
            var body = gson.fromJson(req.body(), ReviewRequest.class);
            addReview(body.product_id, body.user_id, body.rating, body.comment);
            return gson.toJson(new ResponseMessage("Review added successfully"));
        });

        delete("/reviews/:review_id", (req, res) -> {
            int reviewId = Integer.parseInt(req.params("review_id"));
            deleteReview(reviewId);
            return gson.toJson(new ResponseMessage("Review deleted successfully"));
        });

        get("/reviews/:product_id", (req, res) -> {
            int productId = Integer.parseInt(req.params("product_id"));
            return gson.toJson(viewReviews(productId));
        });
    }

    private static List<CartItem> viewCart(int userId) throws SQLException {
        String query = """
                SELECT c.product_id, c.quantity, p.price, p.name
                FROM cart c
                JOIN products p ON c.product_id = p.product_id
                WHERE c.user_id = ?
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);

            try (ResultSet rs = stmt.executeQuery()) {
                List<CartItem> cartItems = new ArrayList<>();
                while (rs.next()) {
                    cartItems.add(new CartItem(
                            rs.getInt("product_id"),
                            rs.getInt("quantity"),
                            rs.getDouble("price"),
                            rs.getString("name")
                    ));
                }
                return cartItems;
            }
        }
    }

    private static void addToCart(int userId, int productId, int quantity) throws SQLException {
        String query = """
                INSERT INTO cart (user_id, product_id, quantity)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE quantity = quantity + ?
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, productId);
            stmt.setInt(3, quantity);
            stmt.setInt(4, quantity);
            stmt.executeUpdate();
        }
    }

    private static void removeFromCart(int userId, int productId) throws SQLException {
        String query = "DELETE FROM cart WHERE user_id = ? AND product_id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, userId);
            stmt.setInt(2, productId);
            stmt.executeUpdate();
        }
    }

    private static String checkout(int userId) throws SQLException {
        String cartQuery = """
                SELECT c.product_id, c.quantity, p.price
                FROM cart c
                JOIN products p ON c.product_id = p.product_id
                WHERE c.user_id = ?
                """;

        String orderInsertQuery = """
                INSERT INTO orders (user_id, total_price)
                VALUES (?, ?)
                """;

        String orderDetailsInsertQuery = """
                INSERT INTO order_details (order_id, product_id, quantity, price)
                VALUES (?, ?, ?, ?)
                """;

        String clearCartQuery = "DELETE FROM cart WHERE user_id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {
            conn.setAutoCommit(false);

       
            List<CartItem> cartItems = new ArrayList<>();
            try (PreparedStatement stmt = conn.prepareStatement(cartQuery)) {
                stmt.setInt(1, userId);
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        cartItems.add(new CartItem(
                                rs.getInt("product_id"),
                                rs.getInt("quantity"),
                                rs.getDouble("price"),
                                ""
                        ));
                    }
                }
            }

            if (cartItems.isEmpty()) {
                throw new RuntimeException("Cart is empty");
            }

    
            double totalPrice = cartItems.stream()
                    .mapToDouble(item -> item.price * item.quantity)
                    .sum();

        
            int orderId;
            try (PreparedStatement stmt = conn.prepareStatement(orderInsertQuery, Statement.RETURN_GENERATED_KEYS)) {
                stmt.setInt(1, userId);
                stmt.setDouble(2, totalPrice);
                stmt.executeUpdate();

                try (ResultSet rs = stmt.getGeneratedKeys()) {
                    if (rs.next()) {
                        orderId = rs.getInt(1);
                    } else {
                        throw new RuntimeException("Failed to create order");
                    }
                }
            }

      
            try (PreparedStatement stmt = conn.prepareStatement(orderDetailsInsertQuery)) {
                for (CartItem item : cartItems) {
                    stmt.setInt(1, orderId);
                    stmt.setInt(2, item.product_id);
                    stmt.setInt(3, item.quantity);
                    stmt.setDouble(4, item.price);
                    stmt.addBatch();
                }
                stmt.executeBatch();
            }

        
            try (PreparedStatement stmt = conn.prepareStatement(clearCartQuery)) {
                stmt.setInt(1, userId);
                stmt.executeUpdate();
            }

            conn.commit();
            return "Order placed successfully. Order ID: " + orderId;
        }
    }

    private static List<Order> fetchOrders(int userId) throws SQLException {
        String ordersQuery = """
                SELECT o.order_id, o.total_price, o.order_date
                FROM orders o
                WHERE o.user_id = ?
                ORDER BY o.order_date DESC
                """;

        String orderDetailsQuery = """
                SELECT od.order_id, od.product_id, od.quantity, od.price, p.name AS product_name
                FROM order_details od
                JOIN products p ON od.product_id = p.product_id
                WHERE od.order_id IN (%s)
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD)) {

            List<Order> orders = new ArrayList<>();
            try (PreparedStatement stmt = conn.prepareStatement(ordersQuery)) {
                stmt.setInt(1, userId);

                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        orders.add(new Order(
                                rs.getInt("order_id"),
                                rs.getDouble("total_price"),
                                rs.getTimestamp("order_date"),
                                new ArrayList<>()
                        ));
                    }
                }
            }

            if (orders.isEmpty()) {
                return orders;
            }

            String orderIds = orders.stream()
                    .map(order -> String.valueOf(order.order_id))
                    .reduce((a, b) -> a + "," + b)
                    .orElse("");

            try (PreparedStatement stmt = conn.prepareStatement(orderDetailsQuery.formatted(orderIds))) {
                try (ResultSet rs = stmt.executeQuery()) {
                    while (rs.next()) {
                        for (Order order : orders) {
                            if (order.order_id == rs.getInt("order_id")) {
                                order.details.add(new OrderDetail(
                                        rs.getInt("product_id"),
                                        rs.getInt("quantity"),
                                        rs.getDouble("price"),
                                        rs.getString("product_name")
                                ));
                            }
                        }
                    }
                }
            }

            return orders;
        }
    }

    private static void addReview(int productId, int userId, int rating, String comment) throws SQLException {
        String query = """
                INSERT INTO reviews (product_id, user_id, rating, comment)
                VALUES (?, ?, ?, ?)
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, productId);
            stmt.setInt(2, userId);
            stmt.setInt(3, rating);
            stmt.setString(4, comment);
            stmt.executeUpdate();
        }
    }

    private static void deleteReview(int reviewId) throws SQLException {
        String query = "DELETE FROM reviews WHERE review_id = ?";

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, reviewId);
            stmt.executeUpdate();
        }
    }

    private static List<Review> viewReviews(int productId) throws SQLException {
        String query = """
                SELECT r.review_id, r.rating, r.comment, r.created_at, u.name AS user_name
                FROM reviews r
                JOIN users u ON r.user_id = u.user_id
                WHERE r.product_id = ?
                ORDER BY r.created_at DESC
                """;

        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             PreparedStatement stmt = conn.prepareStatement(query)) {
            stmt.setInt(1, productId);

            try (ResultSet rs = stmt.executeQuery()) {
                List<Review> reviews = new ArrayList<>();
                while (rs.next()) {
                    reviews.add(new Review(
                            rs.getInt("review_id"),
                            rs.getInt("rating"),
                            rs.getString("comment"),
                            rs.getTimestamp("created_at"),
                            rs.getString("user_name")
                    ));
                }
                return reviews;
            }
        }
    }

    private static class CartRequest {
        int user_id;
        int product_id;
        int quantity;
    }

    private static class UserRequest {
        int user_id;
    }

    private static class ReviewRequest {
        int product_id;
        int user_id;
        int rating;
        String comment;
    }

    private static class CartItem {
        int product_id;
        int quantity;
        double price;
        String name;

        CartItem(int product_id, int quantity, double price, String name) {
            this.product_id = product_id;
            this.quantity = quantity;
            this.price = price;
            this.name = name;
        }
    }

    private static class Order {
        int order_id;
        double total_price;
        Timestamp order_date;
        List<OrderDetail> details;

        Order(int order_id, double total_price, Timestamp order_date, List<OrderDetail> details) {
            this.order_id = order_id;
            this.total_price = total_price;
            this.order_date = order_date;
            this.details = details;
        }
    }

    private static class OrderDetail {
        int product_id;
        int quantity;
        double price;
        String product_name;

        OrderDetail(int product_id, int quantity, double price, String product_name) {
            this.product_id = product_id;
            this.quantity = quantity;
            this.price = price;
            this.product_name = product_name;
        }
    }

    private static class Review {
        int review_id;
        int rating;
        String comment;
        Timestamp created_at;
        String user_name;

        Review(int review_id, int rating, String comment, Timestamp created_at, String user_name) {
            this.review_id = review_id;
            this.rating = rating;
            this.comment = comment;
            this.created_at = created_at;
            this.user_name = user_name;
        }
    }

    private static class ResponseMessage {
        String message;

        ResponseMessage(String message) {
            this.message = message;
        }
    }
}
