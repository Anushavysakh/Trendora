import {
    Box,
    Typography,
    Paper,
    Button,
    Divider,
} from "@mui/material";

import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";

function CartPage() {
    const {
        cartItems,
        removeFromCart,
        updateQuantity,
    } = useCart();
    const navigate = useNavigate();

    const total = cartItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    return (
        <Box sx={{ maxWidth: 1400, mx: "auto", p: 4 }}>

            <Typography
                variant="h4"
                fontWeight={700}
                mb={4}
            >
                Shopping Cart
            </Typography>

            {cartItems.length === 0 ? (
                <Paper sx={{ p: 5, textAlign: "center" }}>
                    <Typography variant="h6">
                        Your cart is empty
                    </Typography>
                </Paper>
            ) : (
                <Box display="flex" gap={4}>

                    {/* Left */}

                    <Box flex={3}>

                        {cartItems.map((item) => (
                            <Paper
                                key={item._id}
                                sx={{
                                    p: 2,
                                    mb: 2,
                                    display: "flex",
                                    gap: 3,
                                }}
                            >

                                <Box
                                    component="img"
                                    src={item.image}
                                    sx={{
                                        width: 140,
                                        height: 140,
                                        objectFit: "contain",
                                    }}
                                />

                                <Box flex={1}>

                                    <Typography
                                        fontWeight={700}
                                        fontSize={20}
                                    >
                                        {item.name}
                                    </Typography>

                                    <Typography color="green">
                                        In Stock
                                    </Typography>

                                    <Typography mt={1}>
                                        ₹{item.price}
                                    </Typography>

                                    <Box
                                        mt={2}
                                        display="flex"
                                        gap={1}
                                        alignItems="center"
                                    >

                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity - 1
                                                )
                                            }
                                        >
                                            -
                                        </Button>

                                        <Typography>
                                            {item.quantity}
                                        </Typography>

                                        <Button
                                            variant="outlined"
                                            onClick={() =>
                                                updateQuantity(
                                                    item._id,
                                                    item.quantity + 1
                                                )
                                            }
                                        >
                                            +
                                        </Button>

                                        <Button
                                            color="error"
                                            onClick={() =>
                                                removeFromCart(item._id)
                                            }
                                        >
                                            Delete
                                        </Button>

                                    </Box>

                                </Box>

                            </Paper>
                        ))}

                    </Box>

                    {/* Right */}

                    <Paper
                        sx={{
                            width: 320,
                            p: 3,
                            height: "fit-content",
                        }}
                    >

                        <Typography
                            variant="h6"
                            fontWeight={700}
                        >
                            Subtotal ({cartItems.length} items)
                        </Typography>

                        <Typography
                            variant="h4"
                            mt={2}
                        >
                            ₹{total}
                        </Typography>

                        <Divider sx={{ my: 3 }} />

                        <Button
                            variant="contained"
                            fullWidth
                            onClick={() => navigate("/checkout")}
                        >
                            Proceed to Checkout
                        </Button>

                    </Paper>

                </Box>
            )}
        </Box>
    );
}

export default CartPage;