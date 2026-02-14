import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import { register } from "../services/BackEndServices"

export const Register = () => {
    const [showPass, setShowPass] = useState(false)
    const [showConfirmPass, setShowConfirmPass] = useState(false)
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()

    const [user, setUser] = useState({
        "email": "",
        "password": "",
        "repeatPassword": ""
    })
    const hadleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (!user.email.trim() || !user.password.trim() || !user.repeatPassword.trim()) {
            setError('All fields are required')
        }
        if (user.password.length < 6 || user.repeatPassword.length < 6) {
            setError('Must contain at least 6 characters')
        }
        if (user.password !== user.repeatPassword) {
            setError('Passwords dont match')
        }
        setIsLoading(true)
        const response = await register(user)

        if (response.error) {
            setIsLoading(false)
            setError(response.error)
            return
        }
        navigate('/')
        return response
    }



    return (
        <div className="container border rounded my-4 shadow-lg mb-5 bg-body-tertiary rounded" style={{ width: "400px", maxWidth: "90%" }}>
            <div className="d-flex justify-content-center my-3" >
                <div className="containe bg-primary p-3 rounded-circle d-flex align-items-center justify-content-center" style={{ width: "100px", height: "100px" }}>
                    <h2 className="text-white"><i className="fa-solid fa-user-lock" style={{ fontSize: "55px" }}></i></h2>
                </div>
            </div>
            <div>
                <form action="submit" onSubmit={handleSubmit}>
                    <legend className="text-center fw-semibold fs-3 mb-4">Registration</legend>
                    {error ? (<div className="alert alert-danger" role="alert">
                        {error}
                    </div>) : (null)}
                    <div className="input-group flex-nowrap my-3">
                        <span className="input-group-text border border-dark" id="addon-email">
                            <i className="fa-regular fa-envelope"></i>
                        </span>
                        <input type="email" className="form-control border border-dark"
                            placeholder="your@email.com"
                            aria-label="email"
                            aria-describedby="addon-email"
                            name="email"
                            value={user.email}
                            onChange={hadleChange}
                            required />
                    </div>
                    <div className="input-group flex-nowrap mt-3 ">
                        <span className="input-group-text border border-black" id="addon-password">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input type={showPass ? ("text") : ("password")}
                            className="form-control border border-dark"
                            placeholder="password"
                            aria-label="password"
                            aria-describedby="addon-password"
                            name="password"
                            value={user.password}
                            onChange={hadleChange}
                            required />
                        <button className="input-group-text btn btn-outline-dark"
                            type="button"
                            onClick={() => setShowPass(!showPass)}>
                            <i className={showPass
                                ? ("fa-regular fa-eye")
                                : ("fa-regular fa-eye-slash")}>

                            </i>
                        </button>
                    </div>
                    {

                    }
                    <div className="input-group flex-nowrap my-3 ">
                        <span className="input-group-text border border-dark" id="addon-repeatPassword">
                            <i className="fa-solid fa-lock"></i>
                        </span>
                        <input type={showConfirmPass ? ("text") : ("password")}
                            className="form-control border border-dark"
                            placeholder="repeat password"
                            aria-label="repeatPassword"
                            aria-describedby="addon-repeatPassword"
                            name="repeatPassword"
                            value={user.repeatPassword}
                            onChange={hadleChange}
                            required />
                        <button className="input-group-text btn btn-outline-dark"
                            type="button"
                            onClick={() => setShowConfirmPass(!showConfirmPass)}>
                            <i className={showConfirmPass
                                ? ("fa-regular fa-eye")
                                : ("fa-regular fa-eye-slash")}>
                            </i>
                        </button>
                    </div>
                    <Link to={"/"} className="text-decoration-none">
                        <p className="text-center text-secondary">
                            Do you have an account? <span className="text-decoration-underline text-primary">Log in</span>
                        </p>
                    </Link>
                    <div >
                        <button type="submit" className="btn btn-primary my-3 w-100 h-100 "
                            disabled={isLoading}>
                            {isLoading ? (
                                <div className="spinner-border spinner-border-sm" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            ) : ('Create account')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}