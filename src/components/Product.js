import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';
import Rating from './Rating';
import React,{ useContext } from 'react';
import { Store } from '../Store';
import { publicRequest } from '../requestMethod';
import { toast } from 'react-toastify';

function Product(props) {
  const { product } = props;

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  function formatCash(str) {
 	return str.split('').reverse().reduce((prev, next, index) => {
 		return ((index % 3) ? next : (next + '.')) + prev
 	})
}

  const addToCartHandler = async (item) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    const { data } = await publicRequest.get(`/api/products/${item._id}`);
    if (data.countInStock < quantity) {
      window.alert('Xin lỗi. Sản phẩm đã hết hàng');
      return;

    } 
      toast.success('Đã thêm sản phẩm vào giỏ hàng');
    
    ctxDispatch({
      type: 'CART_ADD_ITEM',
      payload: { ...item, quantity },
    });
  };

  return (
    <Card>
      <Link to={`/product/${product.slug}`}>
        <img src={product.image} className="card-img-top" alt={product.name} />
      </Link>
      <Card.Body>
        <Link to={`/product/${product.slug}`}>
          <Card.Title>{product.name}</Card.Title>
        </Link>
        {/* <Rating rating={product.rating} numReviews={product.numReviews} /> */}
        <Card.Text>{formatCash(product.price.toString())} VNĐ</Card.Text>
        {product.countInStock === 0 ? (
          <Button variant="light" disabled > 
            Hết hàng
          </Button>
        ) : (
          <Button onClick={() => addToCartHandler(product)}>Thêm vào giỏ hàng</Button>
        )}
      </Card.Body>
    </Card>
  );
}

export default Product;
