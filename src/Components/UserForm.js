import axios from 'axios';
import { useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { userDetailsContext } from './UserDetailsContext';
import ChildForm from './ChildForm';
import XLXS from 'sheetjs-style';
import * as FileSaver from 'file-saver';

export default function UserForm(prop) {

    const { register, handleSubmit, formState: { errors } } = useForm();
    const userDetailsCtx = useContext(userDetailsContext);
    const [numOfChildren, setNumOfChildren] = useState(userDetailsCtx.childrenArr.length);
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const onsubmit = async (d) => {
        console.log('successfuly');
        console.log(userDetailsCtx.user.parent_1_tz);
        await saveUser();
        await saveChildren(userDetailsCtx.user.tz, userDetailsCtx.user.lastName, userDetailsCtx.user.hMO);
        exportToExcel(JSON.stringify(userDetailsCtx.usersDetails), userDetailsCtx.user.lastName)

    }
    const addChild = () => {
        const childrenArray = userDetailsCtx.childrenArr;
        childrenArray.push({ id: numOfChildren, name: "", tz: "", birthDate: new Date() })
        userDetailsCtx.setChildrenArr(childrenArray);
        console.log('childArr', userDetailsCtx.childrenArr);
        setNumOfChildren(numOfChildren + 1);
    }
    const saveUser = async () => {
        console.log(userDetailsCtx.user);
        const usersDataArr = userDetailsCtx.usersDetails;
        usersDataArr.push(userDetailsCtx.user);
        userDetailsCtx.setUsersDetails(usersDataArr);
        await axios.post('https://localhost:7092/api/User', userDetailsCtx.user).then(result => console.log(result + "done.")).catch((e) => { console.log(e); })
    }
    const saveChildren = async (parentTz, lastName, parentHMO) => {
        const childrenArray = userDetailsCtx.childrenArr;
        for (let i = 0; i < userDetailsCtx.childrenArr.length; i++) {
            axios.post('https://localhost:7092/api/User', {
                firstName: childrenArray[i].name,
                lastName: lastName,
                tz: childrenArray[i].tz,
                birthDate: childrenArray[i].birthDate,
                gender: "",
                hMO: parentHMO,
                parent_1_tz: parentTz,
                parent_2_tz: ""
            }).then(result => console.log(result + "done.")).catch((e) => { console.log(e); })
            { console.log(userDetailsCtx.user.firstName) }
            await saveUser();
        }
    }
    const exportToExcel = ((excelData, fileName) => {
        const ws = XLXS.utils.json_to_sheet(excelData);
        const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
        const excelBuffer = XLXS.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    })

    return (
        <form onSubmit={handleSubmit(onsubmit)}>
            <div>
                <label for="firstName" className='form-label'>שם פרטי</label>
                <input type="text" defaultValue={userDetailsCtx.user.firstName} name="firstName"
                    {...register('firstName', {
                        required: true, minLength: 2,
                        pattern: '/^[A-Za-z\s]*$/',
                        onChange: (e) => {
                            userDetailsCtx.setUser({
                                firstName: e.target.value, lastName: userDetailsCtx.user.lastName, tz: userDetailsCtx.user.tz,
                                birthDate: userDetailsCtx.user.birthDate, gender: userDetailsCtx.user.gender, hMO: userDetailsCtx.user.hMO, parent_1_tz: "", parent_2_tz: ""
                            })
                        }
                    })} />
                <div style={{ color: 'red' }}>
                    {errors.firstName?.type === 'pattern' && 'שם חייב להכיל אותיות בלבד'}
                    {errors.firstName?.type === 'minLength' && 'שם קצר מדי'}
                    {errors.firstName?.type === 'required' && 'שם הינו שדה חובה'}
                </div>
            </div>

            <div>
                <label for="lastName" className='form-label'>שם משפחה</label>
                <input type="text" defaultValue={userDetailsCtx.user.lastName} name="lastName"
                    {...register('lastName', {
                        required: true,
                        minLength: 2,
                        pattern: '/[A-Za-z]/',
                        onChange: (e) => {
                            userDetailsCtx.setUser({
                                firstName: userDetailsCtx.user.firstName, lastName: e.target.value, tz: userDetailsCtx.user.tz,
                                birthDate: userDetailsCtx.user.birthDate, gender: userDetailsCtx.user.gender, hMO: userDetailsCtx.user.hMO, parent_1_tz: "", parent_2_tz: ""
                            })
                        }
                    })} />
                <div style={{ color: 'red' }}>
                    {errors.lastName?.type === 'pattern' && 'שם חייב להכיל אותיות בלבד'}
                    {errors.lastName?.type === 'minLength' && 'שם משפחה קצר מדי'}
                    {errors.lastName?.type === 'required' && 'שם משפחה הינו שדה חובה'}
                </div>
            </div>

            <div>
                <label for="tz" className='form-label'>תעודת זהות</label>
                <input type="text" defaultValue={userDetailsCtx.user.tz} name="tz"
                    {...register('tz', {
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
                        onChange: (e) => {
                            userDetailsCtx.setUser({
                                firstName: userDetailsCtx.user.firstName, lastName: userDetailsCtx.user.lastName, tz: e.target.value,
                                birthDate: userDetailsCtx.user.birthDate, gender: userDetailsCtx.user.gender, hMO: userDetailsCtx.user.hMO, parent_1_tz: "", parent_2_tz: ""
                            })
                        }
                    })} />
                <div style={{ color: 'red' }}>
                    {errors.lastName?.type === 'minLength' && 'תעודת זהות צריכה להכיל 9 ספרות'}
                    {errors.lastName?.type === 'required' && 'תעודת זהות צריכה להכיל 9 ספרות'}
                </div>
            </div>

            <div>
                <label for="birthDate" className='form-label'>תאריך לידה</label>
                <input type="date" defaultValue={userDetailsCtx.user.birthDate} name="birthDate" max={new Date().toISOString().split("T")[0]}
                    {...register('birthDate', {
                        required: true, onChange: (e) => {
                            userDetailsCtx.setUser({
                                firstName: userDetailsCtx.user.firstName, lastName: userDetailsCtx.user.lastName, tz: userDetailsCtx.user.tz,
                                birthDate: e.target.value, gender: userDetailsCtx.user.gender, hMO: userDetailsCtx.user.hMO, parent_1_tz: "", parent_2_tz: ""
                            })
                        }
                    })} />
                <div style={{ color: 'red' }}>
                    {errors.lastName?.type === 'required' && 'שדה זה הינו שדה חובה'}
                </div>
            </div>

            <div>
                <label for="gender" className='form-label'>מין</label>
                <select {...register('gender', {
                    required: true,
                    onChange: (e) => {
                        userDetailsCtx.setUser({
                            firstName: userDetailsCtx.user.firstName, lastName: userDetailsCtx.user.lastName, tz: userDetailsCtx.user.tz,
                            birthDate: userDetailsCtx.user.birthDate, gender: e.target.value, hMO: userDetailsCtx.user.hMO, parent_1_tz: "", parent_2_tz: ""
                        })
                        console.log('gender', userDetailsCtx.user.gender);
                        console.log('gender', e);

                    }
                })}>
                    <option value=""></option>
                    <option value="male">זכר</option>
                    <option value="female">נקבה</option>
                </select>
            </div>

            <div>
                <label for="hMO" className='form-label'>קופת חולים</label>
                <select {...register('hMO', {
                    required: true,
                    onChange: (e) => {
                        userDetailsCtx.setUser({
                            firstName: userDetailsCtx.user.firstName, lastName: userDetailsCtx.user.lastName, tz: userDetailsCtx.user.tz,
                            birthDate: userDetailsCtx.user.birthDate, gender: userDetailsCtx.user.gender, hMO: e.target.value, parent_1_tz: "", parent_2_tz: ""
                        })
                    }
                })}>
                    <option value="0">כללית</option>
                    <option value="1">לאומית</option>
                    <option value="2">מכבי</option>
                    <option value="3">מאוחדת</option>
                </select>
            </div>

            <input type="button" value="הוסף ילד" onClick={addChild} className="btn btn-light"/>

            {userDetailsCtx.childrenArr && userDetailsCtx.childrenArr.map((child, index) =>
                <ChildForm index={index} />
            )}

            <input type="submit" value="שמור נתונים" className='btn btn-light'/>

        </form>
    )
}



