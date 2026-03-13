import React, { useState, useEffect } from 'react';
import api from '../api';

const AddMember = ({ refresh }) => {
  const initialState = {
    firstName: '', lastName: '', email: '', countryCode: '+91', mobile: '', birthdate: '',
    sex: '', maritalStatus: '', degree: '', department: '', hall: '', yearOfGraduation: '',
    currentOccupation: '', residenceAddress: '', officeAddress: '', spouseFirstName: '',
    spouseLastName: '', spouseBirthdate: '', anniversaryDate: '', numberOfChildren: 0,
    lifeMemberNumber: '', isLifeMember: false, referredBy: '', password: 'Password123'
  };

  const [formData, setFormData] = useState(initialState);
  const [options, setOptions] = useState({ 
    degrees: [], departments: [], halls: [], maritalStatuses: [], genders: ['Male', 'Female', 'Other'] 
  });
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    api.get('/api/config')
      .then(res => {
        setOptions({
          degrees: res.data.degrees || [],
          departments: res.data.departments || [],
          halls: res.data.halls || [],
          maritalStatuses: res.data.maritalStatuses || [],
          genders: res.data.genders || ['Male', 'Female', 'Other']
        });
      })
      .catch(err => console.error("Config Load Error:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });
      if (image) data.append('profilePic', image);

      await api.post('/api/alumni/register', data);
      alert("Member Added Successfully!");
      setFormData(initialState);
      setImage(null);
      if (refresh) refresh();
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={s.container}>
      <h3 style={s.title}>Add New Member</h3>
      <form onSubmit={handleSubmit}>
        
        {/* SECTION 1: IDENTITY */}
        <div style={s.section}>1. Personal Identity</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>First Name</label><input name="firstName" value={formData.firstName} onChange={handleChange} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Last Name</label><input name="lastName" value={formData.lastName} onChange={handleChange} style={s.input} required /></div>
          <div style={s.field}><label style={s.label}>Email Address</label><input name="email" type="email" value={formData.email} onChange={handleChange} style={s.input} required /></div>
          
          <div style={s.field}>
             <label style={s.label}>Mobile (Code + Number)</label>
             <div style={{display:'flex', gap:'8px'}}>
               <input name="countryCode" placeholder="+91" value={formData.countryCode} onChange={handleChange} style={{...s.input, width:'80px', flex:'none'}} />
               <input name="mobile" placeholder="Mobile Number" value={formData.mobile} onChange={handleChange} style={{...s.input, flex:1}} />
             </div>
          </div>

          <div style={s.field}><label style={s.label}>Birthdate</label><input name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}>
            <label style={s.label}>Sex</label>
            <select name="sex" value={formData.sex} onChange={handleChange} style={s.input} required>
              <option value="">Select...</option>{options.genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>{options.maritalStatuses.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC */}
        <div style={s.section}>2. Academic Details</div>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Degree</label>
            <select name="degree" value={formData.degree} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>{options.degrees.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Department</label>
            <select name="department" value={formData.department} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>{options.departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Hall of Residence</label>
            <select name="hall" value={formData.hall} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>{options.halls.map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Graduation Year</label><input name="yearOfGraduation" type="number" value={formData.yearOfGraduation} onChange={handleChange} style={s.input} /></div>
        </div>

        {/* SECTION 3: SPOUSE & FAMILY */}
        <div style={s.section}>3. Spouse & Family Details</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>Spouse First Name</label><input name="spouseFirstName" value={formData.spouseFirstName} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Spouse Last Name</label><input name="spouseLastName" value={formData.spouseLastName} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Spouse Birthdate</label><input name="spouseBirthdate" type="date" value={formData.spouseBirthdate} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Anniversary Date</label><input name="anniversaryDate" type="date" value={formData.anniversaryDate} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Number of Children</label><input name="numberOfChildren" type="number" value={formData.numberOfChildren} onChange={handleChange} style={s.input} /></div>
        </div>

        {/* SECTION 4: PROFESSIONAL, ADDRESSES & MEMBERSHIP */}
        <div style={s.section}>4. Professional & Membership</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>Current Occupation</label><input name="currentOccupation" value={formData.currentOccupation} onChange={handleChange} style={s.input} /></div>
          
          <div style={s.field}><label style={s.label}>Referred By</label><input name="referredBy" value={formData.referredBy} onChange={handleChange} style={s.input} /></div>
          
          {/* 🌟 LOCKED LIFE MEMBER FIELDS - CLEANED UP */}
          <div style={s.field}>
            <label style={s.label}>Life Member No.</label>
            <input 
              name="lifeMemberNumber" 
              value={formData.lifeMemberNumber} 
              onChange={handleChange} 
              style={{...s.input, backgroundColor: '#f1f5f9', cursor: 'not-allowed', color: '#94a3b8'}} 
              disabled 
              title="Life membership is assigned by admin"
            />
          </div>
          <div style={{display:'flex', alignItems:'center', gap:'10px', marginTop:'20px'}}>
             <input 
               name="isLifeMember" 
               type="checkbox" 
               checked={formData.isLifeMember} 
               onChange={handleChange} 
               style={{width:'18px', height:'18px', cursor: 'not-allowed'}} 
               disabled 
               title="Life membership is assigned by admin"
             />
             <label style={{fontWeight:'bold', fontSize:'0.85rem', color: '#94a3b8'}}>Life Member</label>
          </div>

          <div style={{gridColumn:'span 2'}}>
            <label style={s.label}>Office Address</label>
            <textarea name="officeAddress" value={formData.officeAddress} onChange={handleChange} style={s.textarea} />
          </div>
          <div style={{gridColumn:'span 2'}}>
            <label style={s.label}>Residence Address</label>
            <textarea name="residenceAddress" value={formData.residenceAddress} onChange={handleChange} style={s.textarea} />
          </div>
        </div>

        {/* SECTION 5: PROFILE PICTURE */}
        <div style={s.section}>5. Profile Picture</div>
        <div style={{display:'flex', alignItems:'center', gap:'20px', marginTop:'10px', background:'#f8fafc', padding:'15px', borderRadius:'12px', border:'1px solid #e2e8f0'}}>
           
           {image ? (
             <img src={URL.createObjectURL(image)} alt="New Selection" style={{width:'70px', height:'70px', borderRadius:'50%', objectFit:'cover', border:'2px solid #cbd5e1'}} />
           ) : (
             <div style={{width:'70px', height:'70px', borderRadius:'50%', backgroundColor:'#e2e8f0', display:'flex', alignItems:'center', justifyContent:'center', color:'#94a3b8', fontSize:'0.7rem', textAlign:'center', border:'2px dashed #cbd5e1'}}>No Photo</div>
           )}

           <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
             <label style={{
                padding: '8px 16px', background: '#fff', border: '1px solid #cbd5e1', 
                borderRadius: '8px', color: '#001f3f', fontWeight: 'bold', fontSize: '0.85rem', 
                cursor: 'pointer', textAlign: 'center', display: 'inline-block', boxShadow:'0 1px 2px rgba(0,0,0,0.05)'
             }}>
                {image ? 'Choose New File' : 'Select Profile Picture'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImage(e.target.files[0])} 
                  style={{ display: 'none' }} 
                />
             </label>
             <span style={{fontSize:'0.75rem', color:'#64748b'}}>
                {image ? image.name : 'No file chosen'}
             </span>
           </div>
        </div>

        <button type="submit" disabled={loading} style={s.btn}>
          {loading ? 'Saving...' : 'Register Member'}
        </button>
      </form>
    </div>
  );
};

const s = {
  container: { padding: '20px', background: '#fff', borderRadius: '12px', border: '1px solid #eee' },
  title: { color: '#001f3f', marginBottom: '20px', borderBottom: '2px solid #fbbf24', display: 'inline-block', paddingBottom: '5px' },
  section: { fontWeight: 'bold', color: '#001f3f', marginTop: '30px', marginBottom: '15px', fontSize: '0.9rem', textTransform: 'uppercase', borderBottom: '1px solid #eee', paddingBottom: '5px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' },
  input: { padding: '10px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', backgroundColor: '#fff' },
  textarea: { width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', height: '60px', boxSizing: 'border-box', fontFamily: 'inherit', resize: 'vertical' },
  label: { fontSize: '0.7rem', color: '#64748b', marginBottom: '4px', fontWeight: 'bold', textTransform: 'uppercase', display: 'block' },
  field: { display: 'flex', flexDirection: 'column' },
  btn: { width: '100%', padding: '15px', background: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '8px', fontWeight: 'bold', marginTop: '30px', cursor: 'pointer', fontSize: '1rem' }
};

export default AddMember;