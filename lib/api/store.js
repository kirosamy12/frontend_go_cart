/**
 * Store API utilities
 */

/**
 * Update store information
 * @param {Object} storeData - The store data to update
 * @param {string} storeData.name - Store name
 * @param {string} storeData.username - Store username
 * @param {string} storeData.description - Store description
 * @param {string} storeData.email - Store email
 * @param {string} storeData.contact - Store contact
 * @param {string} storeData.address - Store address
 * @param {File} [storeData.logo] - Store logo file (optional)
 * @param {string} token - Authentication token
 * @returns {Promise<Object>} API response
 */
export async function updateStore(storeData, token) {
  try {
    // Create FormData object
    const formData = new FormData()
    
    // Append all fields to FormData
    formData.append('name', storeData.name)
    formData.append('username', storeData.username)
    formData.append('description', storeData.description)
    formData.append('email', storeData.email)
    formData.append('contact', storeData.contact)
    formData.append('address', storeData.address)
    
    // Append logo if provided
    if (storeData.logo) {
      formData.append('logo', storeData.logo)
    }
    
    // Make API request
    const response = await fetch('https://go-cart-1bwm.vercel.app/api/stores/update', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Note: Do not set Content-Type when using FormData - let the browser set it
      },
      body: formData
    })
    
    // Parse response
    const result = await response.json()
    
    // Check if request was successful
    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}: ${response.statusText}`)
    }
    
    return result
  } catch (error) {
    console.error('Error updating store:', error)
    throw error
  }
}

// Example usage with Axios (if you prefer to use Axios):
/*
import axios from 'axios'

export async function updateStoreWithAxios(storeData, token) {
  try {
    // Create FormData object
    const formData = new FormData()
    
    // Append all fields to FormData
    formData.append('name', storeData.name)
    formData.append('username', storeData.username)
    formData.append('description', storeData.description)
    formData.append('email', storeData.email)
    formData.append('contact', storeData.contact)
    formData.append('address', storeData.address)
    
    // Append logo if provided
    if (storeData.logo) {
      formData.append('logo', storeData.logo)
    }
    
    // Make API request with Axios
    const response = await axios.post(
      'https://go-cart-1bwm.vercel.app/api/stores/update',
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`
          // Note: Do not set Content-Type when using FormData - let the browser set it
        }
      }
    )
    
    return response.data
  } catch (error) {
    console.error('Error updating store:', error)
    throw error
  }
}
*/

export default {
  updateStore
}