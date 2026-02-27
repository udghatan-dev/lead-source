import { useEffect, useState } from 'react';
import { staticDecrypt } from '../../security';

const useProduct = () => {
  let visibility = localStorage.getItem('_pv');
  visibility = visibility ? JSON.parse(staticDecrypt(visibility)) : [];
  const [productVisibility, setProductVisibility] = useState([]);

  useEffect(() => {
    if (productVisibility.length === 0) {
      setProductVisibility(visibility);
    }
  }, [visibility]);

  return productVisibility;
};

export { useProduct };
