import React, { useEffect } from 'react';

/** @TODO: reflection promise status */
const useAsyncEffect = (reflected: (...p: any) => Promise<any>, dependencies: any[]) => {
    useEffect(() => void reflected(), dependencies);
};

export default useAsyncEffect;
