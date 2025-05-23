import { Router } from "express";
import { body, param } from "express-validator";
import handleInputErrors from "../middleware/validation";
import { AuthController } from "../controllers/AuthController";

const router = Router();

router.post('/create-account', 
    body('name')
        .notEmpty().withMessage('El nombre es obligatorio'),
    body('email')
        .notEmpty().withMessage('El Correo Electronico es obligatorio')
        .isEmail().withMessage('Correo Electronico no valido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
            
        }
        return true
    }),
    handleInputErrors,
    AuthController.createAccount
)

router.post('/confirm-account',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    AuthController.confirmAccount
)

router.post('/login',
    body('email')
        .isEmail().withMessage('Email no valido'),
    body('password')
        .notEmpty().withMessage('El password es obligatorio'),
    handleInputErrors,
    AuthController.login
)

router.post('/request-code',
    body('email')
        .isEmail().withMessage('Correo Electronico no valido'),
    handleInputErrors,
    AuthController.requestConfirmationCode
)

router.post('/forgot-password',
    body('email')
        .isEmail().withMessage('Correo Electronico no valido'),
    handleInputErrors,
    AuthController.forgotPassword
)


router.post('/validate-token',
    body('token')
        .notEmpty().withMessage('El Token es obligatorio'),
    handleInputErrors,
    AuthController.validateToken
)


router.post('/new-password/:token',
    param('token')
        .isNumeric().withMessage('Token No Valido'),
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria')
        .isLength({min: 8}).withMessage('La contraseña debe tener al menos 8 caracteres'),
    body('password_confirmation').custom((value, {req}) => {
        if (value !== req.body.password) {
            throw new Error("Las contraseñas no coinciden");
        }
        return true
    }),
    handleInputErrors,
    AuthController.setNewPasswordWithToken
)

export default router;