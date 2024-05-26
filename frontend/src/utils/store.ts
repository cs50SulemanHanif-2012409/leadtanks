import { create } from 'zustand'
import { AdminStats, packageType } from './type'


const useAdminStats = create((set) => ({
    stats: {
        "users": 0,
        "packages": 0,
        "leads": 0,
        "jamalleads": 0,
        "status": false
    },
    setStats: (stats : AdminStats) => set(() => ({ stats})),
    removeStats: () => set({ stats: {} }),
  }))


  const useCart = create((set) => ({
    products : [],
    addProduct: (product: packageType) => set((state : any) => {
      const isProductExist = state.products.find((p : packageType) => p._id === product._id)
      if (isProductExist) {
        return { products: state.products }
      }else{
  
        return { products: [ ...state.products , {...product, _qty : 1}] }
      }
    }),
    updateQty: (product : packageType , qty : number) => set((state : any) => {
      const isProductExist = state.products.find((p : packageType) => p._id === product._id)
      if (isProductExist) {
        return { products: state.products.map((p : packageType) => p._id === product._id ? {...p , _qty : qty} : p) }
      }else{
        return { products: [ ...state.products , {...product, _qty : 1}] }
      }
    }),
    remove : (product : packageType) => set((state : any) => {
      const isProductExist = state.products.find((p : packageType) => p._id === product._id)
      if (isProductExist) {
        return { products: state.products.filter((p : packageType) => p._id !== product._id) }
      }else{
        return { products: state.products }
      } 
    }),
    removeAll: () => set({ products: [] }),
  }))


export  { useAdminStats , useCart }