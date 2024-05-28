"use client";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import Link from "next/link";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const groupedCart = groupCartItems(storedCart);
    setCart(groupedCart);
  }, []);

  const groupCartItems = (cartItems) => {
    const grouped = cartItems.reduce((acc, item) => {
      const existingItem = acc.find((i) => i.id === item.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        acc.push({ ...item, quantity: 1 });
      }
      return acc;
    }, []);
    return grouped;
  };

  const updateCartInLocalStorage = (updatedCart) => {
    localStorage.setItem(
      "cart",
      JSON.stringify(
        updatedCart.flatMap((item) =>
          Array(item.quantity).fill({
            id: item.id,
            img: item.img,
            modelo: item.modelo,
            txt: item.txt,
            precio: item.precio,
          })
        )
      )
    );
    window.dispatchEvent(new CustomEvent("cartUpdated"));
  };

  const incrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
    updateCartInLocalStorage(updatedCart);
  };

  const decrementQuantity = (productId) => {
    const updatedCart = cart
      .map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
      )
      .filter((item) => item.quantity > 0);
    setCart(updatedCart);
    updateCartInLocalStorage(updatedCart);
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.precio * product.quantity,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
    }).format(price);
  };

  const applyPromoCode = () => {
    if (promoCode === "PROMO15") {
      setDiscount(0.15);
      localStorage.setItem("discount", 0.15);
    } else {
      setDiscount(0);
      localStorage.removeItem("discount");
    }
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    return total - total * discount;
  };

  return (
    <Container className="py-3 mt-5">
      <Row className="py-5">
        <Col md={8}>
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>No hay productos en el carrito</p>
          ) : (
            cart.map((product, index) => (
              <Card className="mb-3" key={index}>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Card.Img src={"/img/" + product.img} />
                    </Col>
                    <Col md={8}>
                      <Card.Title>{product.modelo}</Card.Title>
                      <Card.Text>{product.txt}</Card.Text>
                      <Card.Text>{formatPrice(product.precio)}</Card.Text>
                      <div className="d-flex align-items-center">
                        <Button
                          variant="secondary"
                          onClick={() => decrementQuantity(product.id)}
                        >
                          -
                        </Button>
                        <span className="mx-2">{product.quantity}</span>
                        <Button
                          variant="secondary"
                          onClick={() => incrementQuantity(product.id)}
                        >
                          +
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            ))
          )}
        </Col>
        <Col md={4}>
          <h2>Checkout</h2>
          <Card>
            <Card.Body>
              <Card.Title>Resumen del pedido</Card.Title>
              {cart.map((product, index) => (
                <div key={index} className="d-flex justify-content-between">
                  <span>
                    {product.modelo} x {product.quantity}
                  </span>
                  <span>{formatPrice(product.precio * product.quantity)}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>{formatPrice(calculateTotal())}</strong>
              </div>
              <Form.Group controlId="promoCode" className="mt-3">
                <Form.Label>Código promocional</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Introduce el código promocional"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                />
                <Button
                  variant="primary"
                  className="mt-2"
                  onClick={applyPromoCode}
                >
                  Aplicar
                </Button>
              </Form.Group>
              {discount > 0 && (
                <>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total con descuento</strong>
                    <strong>{formatPrice(calculateDiscountedTotal())}</strong>
                  </div>
                </>
              )}
              <Link href="/checkout">
                <Button variant="primary" className="mt-3">
                  Proceder al pago
                </Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Cart;
