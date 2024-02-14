import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    NumberDecrementStepper,
    NumberIncrementStepper,
    NumberInput,
    NumberInputField,
    NumberInputStepper, Select,
    SimpleGrid,
    Text
} from "@chakra-ui/react";
import React, {useEffect} from "react";
import {useTranslation} from "react-i18next";
import {useForm} from "react-hook-form";
import {URLS} from "../constants/url.js";
import usePutQuery from "../hooks/api/usePutQuery.js";
import {get, isArray, isEqual} from "lodash";
import {KEYS} from "../constants/key.js";
import useGetAllQuery from "../hooks/api/useGetAllQuery.js";

export const UpdateItem = ({
                               isOpen,
                               onClose,
                               itemData,
                               listKeyId,
                               url,
                               title,
                               ...rest
}) => {
    const { t } = useTranslation();
    const { mutate, isLoading } = usePutQuery({listKeyId});
    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = useForm();

    const {data,refetch:categoryRefetch} = useGetAllQuery({
        key: KEYS.category_get_all,
        url: URLS.category_get_all,
        enabled: false,
        params: {
            params: {
                size: 200
            }
        }
    })

    useEffect(() => {
        if (isEqual(url,URLS.product_edit)){
            categoryRefetch();
        }
    }, [url]);

    const onSubmit = (values) => {
        mutate(
            { url: `${url}/${get(itemData,'id')}`, attributes: values },
            {
                onSuccess: ({ data }) => {
                    onClose();
                },
            }
        );
    };
    return(
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size={{base: 'sm', md: 'xl'}}
            {...rest}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{t(title)}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <SimpleGrid columns={{base: 1}} gap={5}>
                            <FormControl isInvalid={errors.nameUz}>
                                <FormLabel htmlFor="nameUz">{t('Name UZ')}</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="nameUz"
                                        {...register("nameUz", {
                                            required: true,
                                        })}
                                        defaultValue={get(itemData,'nameUz',)}
                                        placeholder={t("Name")}
                                    />
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.nameUz && errors.nameUz.message}
                                </FormErrorMessage>
                            </FormControl>

                            <FormControl isInvalid={errors.nameRu}>
                                <FormLabel htmlFor="nameRu">{t('Name RU')}</FormLabel>
                                <InputGroup>
                                    <Input
                                        id="nameRu"
                                        {...register("nameRu", {
                                            required: true,
                                        })}
                                        defaultValue={get(itemData,'nameRu')}
                                        placeholder={t("Name")}
                                    />
                                </InputGroup>
                                <FormErrorMessage>
                                    {errors.nameRu && errors.nameRu.message}
                                </FormErrorMessage>
                            </FormControl>
                            {
                                !isEqual(listKeyId,KEYS.market_get_all) && (
                                    <FormControl>
                                        <FormLabel htmlFor="number">{t('Ordinal number')}</FormLabel>
                                        <NumberInput
                                            step={1}
                                            defaultValue={get(itemData,'number')}
                                            min={0}
                                            {...register("number")}
                                        >
                                            <NumberInputField />
                                            <NumberInputStepper>
                                                <NumberIncrementStepper />
                                                <NumberDecrementStepper />
                                            </NumberInputStepper>
                                        </NumberInput>
                                    </FormControl>
                                )
                            }
                            {
                                isEqual(url,URLS.product_edit) && (
                                    <FormControl>
                                        <FormLabel htmlFor="categoryId">{t("Category")}</FormLabel>
                                        <Select
                                            placeholder='Select category'
                                            {...register("categoryId", {
                                                required: true,
                                            })}
                                        >
                                            {
                                                isArray(get(data,'data.data.content',[])) && (
                                                    get(data,'data.data.content',[]).map((item) => (
                                                        <option value={get(item,'id')}>
                                                            <Text>{get(item,'nameUz')}</Text>
                                                            <Text>{get(item,'nameRu')}</Text>
                                                        </option>
                                                    ))
                                                )
                                            }
                                        </Select>
                                    </FormControl>

                                )
                            }

                        </SimpleGrid>
                        <Button
                            mt={4}
                            isLoading={isSubmitting}
                            type="submit"
                            width={"100%"}
                            colorScheme={'blue'}
                        >
                            <Text color="white">{t("Edit")}</Text>
                        </Button>
                    </form>
                </ModalBody>
                <ModalFooter>
                    <Button onClick={onClose}>
                        {t('Back')}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}