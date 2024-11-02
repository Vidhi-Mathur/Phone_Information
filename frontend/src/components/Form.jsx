import { useEffect, useState } from 'react'
import { CheckCircle, ChevronDown, Globe, Phone, RefreshCw, User, XCircle } from "lucide-react"
import * as Yup from "yup"

//Country codes and format corresponding to a particular country
const countryCodes = [
    { code: '+1', country: 'United States', format: /^\d{10}$/ }, 
    { code: '+44', country: 'United Kingdom', format: /^\d{11}$/ },
    { code: '+91', country: 'India', format: /^\d{10}$/ }, 
    { code: '+81', country: 'Japan', format: /^\d{10}$/ }, 
    { code: '+86', country: 'China', format: /^\d{11}$/ } 
]

//To display message based on form status
const formStatus = [
    { status: true, icon: <CheckCircle className="text-green-500" />, message: "Information submitted successfully!" },
    { status: false, icon: <XCircle className="text-red-500" />, message: "Failed to submit, try again later" }
]

//Validate form
const validationSchema = Yup.object().shape({
    name: Yup.string().matches(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces').required('Name is required'),
    countryCode: Yup.string().required('Country code is required'),
    phone: Yup.string().required('Phone number is required').test('is-valid-phone', 'Phone number is invalid', function (value) {
      const { countryCode } = this.parent
      const country = countryCodes.find((c) => c.code === countryCode)
      return country ? country.format.test(value) : /^\d+$/.test(value)
    })
})

export const Form = () => {
    const [activeForm, setActiveForm] = useState('A')
    const [formData, setFormData] = useState({
      name: '',
      countryCode: '',
      phone: ''
    })
    const [errors, setErrors] = useState({})
    const [loading, setLoading] = useState(false)
    const [submissionStatus, setSubmissionStatus] = useState(null)
  
    //To handle form submission
    const submitHandler = async(e) => {
        e.preventDefault()
        setLoading(true)
        try {
            await validationSchema.validate(formData, { abortEarly: false})
            const response = await fetch('http://localhost:3000', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    formType: activeForm,
                    name: formData.name,
                    phone: formData.phone,
                    countryCode: formData.countryCode
                })
            });
            const result = await response.json();
            if (!response.ok) {
                setSubmissionStatus(false)
                return;
            }
            setErrors({})
            setFormData({
                name: '',
                countryCode: '',
                phone: ''
            })
            setSubmissionStatus(true)
            return result
        }
        catch(error){
            const newErrors = {}
            error.inner.forEach((err) => {
              newErrors[err.path] = err.message
            })
            setErrors(newErrors)
            setSubmissionStatus(false)
        }
        finally {
            setLoading(false)
        }
    }

    //To remove success/ failure status of form after 3 sec
    useEffect(() => {
        if (submissionStatus !== null) {
            const timer = setTimeout(() => setSubmissionStatus(null), 3000); 
            return () => clearTimeout(timer); 
        }
    }, [submissionStatus]);

    //Switch forms between A and B
    const switchFormHandler = (formType) => {
        setActiveForm(formType)
    }

    //Update inputs
    const inputChangeHandler = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
    };

    //To download updated excel sheet
    const refreshHandler = () => {
        window.open('http://localhost:3000/excel', '_blank')
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100 to-teal-100 p-4">
            <div className="w-full max-w-md bg-white bg-opacity-80 backdrop-blur-md rounded-2xl shadow-lg overflow-hidden border border-white">
                <div className="bg-gradient-to-r from-teal-400 to-cyan-300 text-white py-6 px-8">
                    <h2 className="text-3xl font-light">Phone Information</h2>
                    <p className="text-teal-50 mt-2">Please enter your details below</p>
                </div>
                <div className="p-8">
                    <div className="flex mb-8 bg-gray-50 rounded-full p-1">
                        {['A', 'B'].map((form) => (
                            <button key={form} onClick={() => switchFormHandler(form)} className={`flex-1 py-2 text-sm font-medium rounded-full transition-all duration-300 ${activeForm === form? 'bg-white text-teal-600 shadow-lg': 'text-gray-500 hover:text-teal-600' }`}>
                                Form {form}
                            </button>
                        ))}
                    </div>
                    <form onSubmit={submitHandler} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                                <User className="w-4 h-4 text-teal-400" />
                                <span>Name</span>
                            </label>
                            <input type="text" id="name" name="name" placeholder="Enter your name" value={formData.name} onChange={inputChangeHandler} className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300 ${errors.name? 'border-red-300': 'border-gray-200' }`}/>
                            {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="countryCode" className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                                <Globe className="w-4 h-4 text-teal-400" />
                                <span>Country Code</span>
                            </label>
                            <div className="relative">
                                <select id="countryCode" name="countryCode" value={formData.countryCode} onChange={inputChangeHandler} className={`w-full px-4 py-2 border rounded-full appearance-none focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300 ${errors.countryCode? 'border-red-300': 'border-gray-200' }`}>
                                    <option value="">Select a country code</option>
                                    {countryCodes.map((country) => (
                                        <option key={country.code} value={country.code}>
                                            {country.country} ({country.code})
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </div>
                            {errors.countryCode && <p className="text-red-400 text-xs mt-1">{errors.countryCode}</p>}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="flex items-center space-x-2 text-sm font-medium text-gray-600">
                                <Phone className="w-4 h-4 text-teal-400" />
                                <span>Phone Number</span>
                            </label>
                            <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" value={formData.phone} onChange={inputChangeHandler} className={`w-full px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-teal-300 transition-all duration-300 ${errors.phone? 'border-red-300': 'border-gray-200'}`}/>
                            {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
                        </div>
                        <button type="submit" className="w-full bg-gradient-to-r from-teal-400 to-cyan-300 text-white rounded-full py-2 px-4 text-sm font-medium hover:from-teal-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-all duration-300">
                            Submit
                        </button>
                    </form>
                    {submissionStatus !== null && (
                        <div className={`flex items-center space-x-2 mt-4`}>
                            {formStatus.find(statusObj => statusObj.status === submissionStatus).icon}
                            <p>{formStatus.find(statusObj => statusObj.status === submissionStatus).message}</p>
                        </div>
                    )}
                </div>
            </div>
            <button disabled={loading} onClick={refreshHandler} className="flex items-center justify-center space-x-2 bg-white text-teal-600 rounded-full py-2 px-6 text-sm font-medium hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-all duration-300 shadow-md mt-6">
                <RefreshCw className="w-4 h-4" />
                <span>Refresh Excel</span>
            </button>
        </div>
    )
}