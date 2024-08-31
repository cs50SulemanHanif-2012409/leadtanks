import React from 'react'
import { Button, Center, HStack, Input, InputGroup, InputRightElement, Select, Stack, Text } from "@chakra-ui/react";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { FaCreditCard } from "react-icons/fa";

interface CheckoutFormProps {
    onSubmit: (data: any) => void;
}


const CheckoutForm = (props: CheckoutFormProps) => {

    const [cardNumberInput, setCardNumberInput] = React.useState<string>('')
    const [cardNumberError, setcardNumberError] = React.useState<string>('')

    const [expirationDateInput, setexpirationDateInput] = React.useState<string>('')
    const [expirationDateError, setexpirationDateError] = React.useState<string>('')

    const [cvcInput, setcvcInput] = React.useState<string>('')
    const [cvcError, setcvcError] = React.useState<string>('')

    function validateCardNumber() {
        const cardNumber = cardNumberInput.replace(/\s/g, '');

        if (cardNumber.length !== 16 || !/^\d+$/.test(cardNumber)) {
            setcardNumberError('Please enter a valid 16-digit card number.');
            return false;
        } else {
            setcardNumberError('');
            return true;
        }
    }

    function validateExpirationDate() {
        const expirationDate = expirationDateInput;
        const expirationDateError = document.getElementById('expiration-date-error');

        if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expirationDate)) {
            setexpirationDateError('Please enter a valid expiration date in the format MM/YY.')
            return false;
        } else {
            setexpirationDateError('')
            return true;
        }
    }

    function validateCVC() {
        const cvc = cvcInput;

        if (cvc.length !== 3 || !/^\d+$/.test(cvc)) {
            setcvcError('Please enter a valid 3-digit CVC.')
            return false;
        } else {
            setcvcError('')
            return true;
        }
    }


    const handleCardNumberChange = (event: any) => {
        let value = event.target.value;
        value = value.replace(/\D/g, ''); // Remove non-numeric characters
        value = value.replace(/(\d{4})(?=\d)/g, '$1 '); // Add hyphen after every 4 digits
        setCardNumberInput(value);
    };

    const handleExpirationDateChange = (event : any) => {
        let value = event.target.value;
        value = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.length > 2) {
          value = `${value.slice(0, 2)}/${value.slice(2)}`;
        }
        setexpirationDateInput(value);
      };

    const onSubmit = () => {
        const data = {
            cardNumber: cardNumberInput,
            expirationDate: expirationDateInput,
            cvc: cvcInput
        }

        if (validateCardNumber() && validateExpirationDate() && validateCVC()) {
            props.onSubmit(data)
        }
    }

    return (
        <form >

            <Stack my={4}>
                <label>Credit Card</label>
                <InputGroup>
                    <Input type="text" placeholder="1234 1234 1234 1234" value={cardNumberInput}
                        onChange={handleCardNumberChange} />
                    <InputRightElement gap={1} >
                        <FaCcVisa />
                        <FaCcMastercard />
                    </InputRightElement>
                </InputGroup>
                {cardNumberError && <Text color={'red.500'} >{cardNumberError}</Text>}
            </Stack>
            <HStack my={4}>
                <Stack>
                    <label >Expiration</label>
                    <Input type="text" placeholder="MM/YY" value={expirationDateInput} onChange={handleExpirationDateChange} />
                    {expirationDateError && <Text color={'red.500'} >{expirationDateError}</Text>}
                </Stack>
                <Stack>
                    <label >CVV</label>
                    <InputGroup>
                        <Input type="text" placeholder="CVV" value={cvcInput} onChange={(e) => setcvcInput(e.target.value)} />
                        <InputRightElement gap={1} >
                            <FaCreditCard />
                        </InputRightElement>
                    </InputGroup>
                    {cvcError && <Text color={'red.500'} >{cvcError}</Text>}
                </Stack>
            </HStack>
            <Select placeholder="country">
                <option value="PK">Pakistan</option>
                <option value="USA">USA</option>
            </Select>
            <Center my={3}>
                <Button onClick={onSubmit} width={'80%'} colorScheme='teal' >Pay Now</Button>
            </Center>
        </form>
    )
};

export default CheckoutForm;