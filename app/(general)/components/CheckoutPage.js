"use client";
import React, { useEffect, useState } from "react";
import { Container, Form, Button, Col, Card, Row } from "react-bootstrap";

const CheckoutPage = () => {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    email: "",
    phone: "",
    cardNumber: "",
  });

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const groupedCart = groupCartItems(storedCart);
    setCart(groupedCart);

    const storedDiscount = parseFloat(localStorage.getItem("discount")) || 0;
    setDiscount(storedDiscount);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const calculateTotal = () => {
    return cart.reduce(
      (total, product) => total + product.precio * product.quantity,
      0
    );
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    return total - total * discount;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar los datos del formulario a tu backend para procesar el pago
    console.log("Datos del formulario:", formData);
    // También puedes redirigir al usuario a una página de confirmación
  };

  const formatPrice = (price) => {
    if (typeof price !== "number" || isNaN(price)) {
      return ""; // O cualquier otro valor predeterminado que desees mostrar
    }
    return price.toLocaleString("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
    });
  };

  return (
    <Container className="py-5 my-5">
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={8}>
            <h2>Datos de cobro</h2>
            <Form.Group controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su nombre"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="address">
              <Form.Label>Dirección de entrega</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su dirección de entrega"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Ingrese su email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="phone">
              <Form.Label>Número de teléfono</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese su número de teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="cardNumber">
              <Form.Label>Número de tarjeta de débito</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ingrese el número de su tarjeta de débito"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <h2>Tarjeta Checkout</h2>
            <Card>
              <Card.Body>
                <Card.Title>Resumen del pedido</Card.Title>
                {cart.map((product, index) => (
                  <div key={index} className="d-flex justify-content-between">
                    <span>
                      {product.modelo} x {product.quantity}
                    </span>
                    <span>
                      {formatPrice(product.precio * product.quantity)}
                    </span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total</strong>
                  <strong>{formatPrice(calculateTotal())}</strong>
                </div>
                {discount > 0 && (
                  <>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total con descuento</strong>
                      <strong>{formatPrice(calculateDiscountedTotal())}</strong>
                    </div>
                  </>
                )}
                <Button variant="primary" type="submit" className="mt-3">
                  Pagar
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Form>
    </Container>
  );
};

export default CheckoutPage;
