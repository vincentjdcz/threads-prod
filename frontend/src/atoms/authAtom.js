import { atom } from 'recoil';

const authScreenAtom = atom({
    key: 'authScreenAtom',
    default: 'login'
})

export default authScreenAtom;

/*
See https://www.youtube.com/watch?v=qjiaOLxcllI&list=PLYXp821z9yw7t3a-cjwpNiezHCA6R_Irv&index=31 
to learn about recoil atoms

https://www.youtube.com/watch?v=sQeFHYQx78o&list=PLYXp821z9yw7t3a-cjwpNiezHCA6R_Irv&index=32
to learn about recoil selectors

Atoms basically hold pieces of state
Selectors are basically functions that derive state from atoms (so given some atom - aka state - produce some new state)
can use the useRecoilState hook to get a tuple with the state and a state updater function. Using this function will also
subscribe that component to that atom, and any time there's a change to it this component will be "informed"
there are also hooks for just getting the state value or just getting the updater function

Atoms need a unique key
*/