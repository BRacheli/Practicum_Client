import { useContext,useState } from 'react';
import { useForm } from 'react-hook-form';
import { userDetailsContext } from './UserDetailsContext';

export default function ChildForm(props){

    const { register, formState: { errors } } = useForm();
    const userDetailsCtx=useContext(userDetailsContext);
    const index=props.index;
    const [childData,setChildData]=useState({name:"",tz:"",birthDate:new Date()})

    const saveChildData=()=>{
        let childrenArray= userDetailsCtx.childrenArr;
        childrenArray[index]=childData;
        userDetailsCtx.setChildrenArr(childrenArray);
    }

    return (
        <>
             <p>ילד {index+1}</p>
             <div>
                 <label for={`childName${index}`}>שם פרטי</label>
                 {console.log('childrenArr[index].name',userDetailsCtx.childrenArr[index].name)}
                 <input type="text" defaultValue={userDetailsCtx.childrenArr[index].name} name={`childName${index}`} 
                    {...register(`childName${index}` ,{
                         required: true,
                         minLength: 2,
                         pattern: '/[A-Za-z]/',
                         onChange: (e) => {
                            setChildData({name:e.target.value,tz:childData.tz,birthDate:childData.birthDate})
                         }
                     })} />
             </div>

              <div>
                 <label for={`childTz${index}`}>תעודת זהות</label>
                 <input type="text" defaultValue={userDetailsCtx.childrenArr[index].tz} name={`childTz${index}`}
                     {...register(`childTz${index}`, {
                         required: true,
                         minLength: 9,
                         maxLength: 9,
                         validate: (e) => {
                            //Israeli Id Validator:
                            var e = String(e).trim();
                            if (e.length > 9 || e.length < 5 || isNaN(e)) return false;
                            // Pad string with zeros up to 9 digits
                            e = e.length < 9 ? ("00000000" + e).slice(-9) : e;

                            return Array
                                .from(e, Number)
                                .reduce((counter, digit, i) => {
                                    const step = digit * ((i % 2) + 1);
                                    return counter + (step > 9 ? step - 9 : step);
                                }) % 10 === 0;
                        },
                         onChange:(e)=>{
                         setChildData({name:childData.name,tz:e.target.value,birthDate:childData.birthDate})
                     } })} />
             </div>

             <div>
                 <label for={`childBirthDate${index}`}>תאריך לידה</label>
                 <input type="date" defaultValue={userDetailsCtx.childrenArr[index].birthDate} name={`childBirthDate${index}`} max = {new Date().toISOString().split("T")[0]}
                     {...register(`childBirthDate${index}`, {
                         required: true ,
                         onChange:(e)=>{
                         setChildData({name:childData.name,tz:childData.tz,birthDate:e.target.value})
                     }})} />
             </div>

       <input type="button" value="√" onClick={saveChildData} className="btn btn-outline-dark"/>
        </>
    )
}
