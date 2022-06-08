import { ReactComponent as TrashCanIcon } from 'assets/trashCanIcon.svg';
import { CartItem, Item } from 'types/domain';
import styled from 'styled-components';
import CroppedImage from 'components/common/CroppedImage';
import { flexCenter } from 'styles/mixin';
import CheckBox from 'components/common/CheckBox';
import useUpdateCartItem from 'hooks/useUpdateCartItem';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import Controller from './Controller';
import { formatDecimal } from 'utils';

const CartList = ({
  cartList,
  cartDetail,
  cartListWithDetail,
  setPaymentsAmount,
  children,
}: {
  cartList: CartItem[];
  cartDetail: Item[];
  cartListWithDetail: any[];
  setPaymentsAmount: Dispatch<SetStateAction<number>>;
  children: React.ReactNode;
}) => {
  const { toggleCartItemWillPurchase } = useUpdateCartItem(cartList);
  const { updateCartItemQuantity, removeCartItem } = useUpdateCartItem(cartList);

  useEffect(() => {
    setPaymentsAmount(totalPaymentsPrice);
  });

  const isAllItemWillPurchase = cartList.every(cartItem => cartItem.willPurchase);
  const totalPaymentsPrice = cartListWithDetail.reduce((prev, after) => {
    if (after.willPurchase) {
      return prev + after.price * after.quantity;
    }

    return prev;
  }, 0);

  const toggleCheckedAll = () => {
    if (isAllItemWillPurchase) {
      toggleAll(true);

      return;
    }

    toggleAll(false);
  };

  const toggleAll = (check: boolean) => {
    cartList.forEach(cartItem => {
      if (cartItem.willPurchase === check) {
        toggleCartItemWillPurchase(cartItem.id);
      }
    });
  };

  const toggleChecked = (targetId: number) => {
    toggleCartItemWillPurchase(targetId);
  };

  const modifyQuantity = (targetId: number, type: 'Increase' | 'Decrease') => {
    updateCartItemQuantity(targetId, type, 1);
  };

  const deleteItem = (targetId: number) => {
    removeCartItem(targetId);
  };

  return (
    <StyledRoot>
      <ButtonSet>
        <SelectItemAll>
          <CheckBox
            id='전체 선택'
            checked={isAllItemWillPurchase}
            onChange={toggleCheckedAll}
          ></CheckBox>
          <p>선택 해제</p>
        </SelectItemAll>
        <DeleteSelectedButton>상품 삭제</DeleteSelectedButton>
      </ButtonSet>
      <CartItemListHeader>든든상품배송 {`( ${cartList.length} )`}개</CartItemListHeader>
      <CartItemList>
        {children}
        {cartList.map(cartItem => {
          const id = cartItem.id;
          const detail = cartDetail.filter(item => item.id === id)[0];
          const totalPrice = cartItem.quantity * detail.price;

          return (
            <CartItemContainer key={cartItem.id}>
              <CheckBox
                id={`${cartItem.id}`}
                checked={cartItem.willPurchase}
                onChange={() => toggleChecked(id)}
              />
              <CroppedImage src={detail.thumbnailUrl} width='150px' height='144px' alt='상품' />
              <ItemName>{detail.title}</ItemName>
              <StyledRight>
                <TrashCan id={cartItem.id} onClick={() => deleteItem(id)} />
                <Controller
                  id={cartItem.id}
                  quantity={cartItem.quantity}
                  modifyQuantity={modifyQuantity}
                ></Controller>
                <TotalPrice>{formatDecimal(totalPrice)} 원</TotalPrice>
              </StyledRight>
            </CartItemContainer>
          );
        })}
      </CartItemList>
    </StyledRoot>
  );
};

const StyledRoot = styled.div`
  grid-area: cl;
  display: inline-block;
  width: 73.6rem;
  height: 72.4rem;
`;

const ButtonSet = styled.div`
  display: flex;
  justify-content: space-between;

  margin-bottom: 2rem;
`;

const DeleteSelectedButton = styled.button`
  ${flexCenter}
  width: 11.7rem;
  height: 5rem;
  border: solid silver 1px;
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  font-size: 1.6rem;
  line-height: 2.1rem;

  text-align: center;
`;

const SelectItemAll = styled.div`
  display: flex;
  font-size: 2rem;
  width: 13.5rem;

  justify-content: space-between;
`;

const CartItemListHeader = styled.p`
  padding: 0.5rem 0rem;

  border-bottom: solid silver 0.4rem;
  font-size: 2rem;
`;

const CartItemList = styled.div`
  width: 73.6rem;
  height: 70rem;
  overflow: auto;

  padding-right: 1rem;

  &::-webkit-scrollbar {
    width: 6px;
    background-color: inherit;
  }
  &::-webkit-scrollbar-thumb {
    background-color: inherit;
  }
  &::-webkit-scrollbar-track {
    background-color: inherit;
  }
`;

const CartItemContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;

  border-bottom: solid silver 0.15rem;
  padding: 2rem 0;
`;

const ItemName = styled.div`
  width: 26rem;
  padding: 0rem 2rem;
  font-family: 'Noto Sans KR';
  font-style: normal;
  font-weight: 400;
  font-size: 2rem;
`;

const StyledRight = styled.div`
  display: flex;
  flex-direction: column;

  gap: 2rem;
  align-items: flex-end;
  width: 20rem;
`;

const TrashCan = styled(TrashCanIcon)`
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const TotalPrice = styled.p`
  font-size: 1.6rem;
`;

export default CartList;