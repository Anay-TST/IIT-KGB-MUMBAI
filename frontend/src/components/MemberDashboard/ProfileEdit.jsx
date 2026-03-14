import React, { useState, useEffect } from 'react';
import api, { BACKEND_URL } from '../../api';

const ProfileEdit = () => {
  const [formData, setFormData] = useState({
    firstName: '', lastName: '', email: '', countryCode: '', mobile: '', birthdate: '',
    sex: '', maritalStatus: '', degree: '', department: '', hall: '', yearOfGraduation: '',
    currentOccupation: '', residenceAddress: '', officeAddress: '', spouseFirstName: '',
    spouseLastName: '', spouseBirthdate: '', anniversaryDate: '', numberOfChildren: 0,
    referredBy: '', lifeMemberNumber: '', isLifeMember: false
  });

  const [originalData, setOriginalData] = useState(null);
  const [options, setOptions] = useState({ 
    degrees: [], departments: [], halls: [], maritalStatuses: [], genders: ['Male', 'Female', 'Other'] 
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const [configRes, profileRes] = await Promise.all([
        api.get('/api/config'),
        api.get('/api/alumni/profile')
      ]);
      
      setOptions({
        degrees: configRes.data.degrees || [],
        departments: configRes.data.departments || [],
        halls: configRes.data.halls || [],
        maritalStatuses: configRes.data.maritalStatuses || [],
        genders: configRes.data.genders || ['Male', 'Female', 'Other']
      });
      
      if (profileRes.data) {
        setFormData(profileRes.data);
        setOriginalData(profileRes.data);
      }
    } catch (err) {
      console.error("Error loading profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    if (window.confirm("Discard all unsaved changes?")) {
      setFormData(originalData);
      setImage(null);
    }
  };

  const formatDate = (d) => (d ? d.split('T')[0] : '');
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      const fields = [
        'firstName', 'lastName', 'email', 'countryCode', 'mobile', 'birthdate', 'sex', 
        'maritalStatus', 'yearOfGraduation', 'degree', 'department', 'hall', 
        'currentOccupation', 'residenceAddress', 'officeAddress', 'spouseFirstName', 
        'spouseLastName', 'spouseBirthdate', 'anniversaryDate', 'numberOfChildren', 
        'referredBy', 'lifeMemberNumber', 'isLifeMember'
      ];
      
      fields.forEach(key => {
        if (formData[key] !== undefined && formData[key] !== null) {
          data.append(key, formData[key]);
        }
      });

      if (image) data.append('profilePic', image);
      
      await api.put('/api/alumni/profile', data);
      setOriginalData(formData);
      alert("Profile updated successfully!");
    } catch (err) {
      alert(err.response?.data?.message || "Error saving profile");
    } finally {
      setSaving(false);
    }
  };

  // 🌟 THE UPGRADED SAFETY NET: Preserves legacy data AND guarantees strict alphabetical sorting
  const getSafeOptions = (configArray, currentValue) => {
    let finalArray = configArray || [];
    if (currentValue && !finalArray.includes(currentValue)) {
      finalArray = [...finalArray, currentValue];
    }
    return [...finalArray].sort((a, b) => a.localeCompare(b));
  };

  if (loading) return <div style={{padding:'50px', textAlign:'center', color:'#001f3f'}}>Loading your profile...</div>;

  return (
    <div style={s.container}>
      <h2 style={s.mainTitle}>My Profile Settings</h2>
      <form onSubmit={handleSave}>
        
        {/* SECTION 1: IDENTITY */}
        <div style={s.section}>1. Personal Identity</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>First Name</label><input name="firstName" value={formData.firstName || ''} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Last Name</label><input name="lastName" value={formData.lastName || ''} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Email Address</label><input name="email" type="email" value={formData.email || ''} onChange={handleChange} style={s.input} /></div>
          
          <div style={s.field}>
             <label style={s.label}>Mobile (Code + Number)</label>
             <div style={{display:'flex', gap:'10px'}}>
               <input 
                 name="countryCode" 
                 placeholder="+91" 
                 value={formData.countryCode || ''} 
                 onChange={handleChange} 
                 style={{...s.input, width:'80px', flex:'none'}} 
               />
               <input 
                 name="mobile" 
                 placeholder="Mobile Number" 
                 value={formData.mobile || ''} 
                 onChange={handleChange} 
                 style={{...s.input, flex:1}} 
               />
             </div>
          </div>

          <div style={s.field}><label style={s.label}>Birthdate</label><input name="birthdate" type="date" value={formatDate(formData.birthdate)} onChange={handleChange} style={s.input} /></div>
          
          <div style={s.field}>
            <label style={s.label}>Sex</label>
            <select name="sex" value={formData.sex || ''} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>
              {getSafeOptions(options.genders, formData.sex).map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus || ''} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>
              {getSafeOptions(options.maritalStatuses, formData.maritalStatus).map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC */}
        <div style={s.section}>2. Academic Details</div>
        <div style={s.grid}>
          <div style={s.field}>
            <label style={s.label}>Degree</label>
            <select name="degree" value={formData.degree || ''} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>
              {getSafeOptions(options.degrees, formData.degree).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Department</label>
            <select name="department" value={formData.department || ''} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>
              {getSafeOptions(options.departments, formData.department).map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div style={s.field}>
            <label style={s.label}>Hall of Residence</label>
            <select name="hall" value={formData.hall || ''} onChange={handleChange} style={s.input}>
              <option value="">Select...</option>
              {getSafeOptions(options.halls, formData.hall).map(h => <option key={h} value={h}>{h}</option>)}
            </select>
          </div>
          <div style={s.field}><label style={s.label}>Graduation Year</label><input name="yearOfGraduation" type="number" value={formData.yearOfGraduation || ''} onChange={handleChange} style={s.input} /></div>
        </div>

        {/* SECTION 3: SPOUSE & FAMILY */}
        <div style={s.section}>3. Spouse & Family Details</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>Spouse First Name</label><input name="spouseFirstName" value={formData.spouseFirstName || ''} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Spouse Last Name</label><input name="spouseLastName" value={formData.spouseLastName || ''} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Spouse Birthdate</label><input name="spouseBirthdate" type="date" value={formatDate(formData.spouseBirthdate)} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Anniversary Date</label><input name="anniversaryDate" type="date" value={formatDate(formData.anniversaryDate)} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Number of Children</label><input name="numberOfChildren" type="number" value={formData.numberOfChildren || 0} onChange={handleChange} style={s.input} /></div>
        </div>

        {/* SECTION 4: PROFESSIONAL, ADDRESSES & MEMBERSHIP */}
        <div style={s.section}>4. Professional & Membership</div>
        <div style={s.grid}>
          <div style={s.field}><label style={s.label}>Current Occupation</label><input name="currentOccupation" value={formData.currentOccupation || ''} onChange={handleChange} style={s.input} /></div>
          <div style={s.field}><label style={s.label}>Referred By</label><input name="referredBy" value={formData.referredBy || ''} onChange={handleChange} style={s.input} /></div>
          
          {/* LOCKED LIFE MEMBER FIELDS */}
          <div style={s.field}>
            <label style={s.label}>Life Member No.</label>
            <input 
              name="lifeMemberNumber" 
              value={formData.lifeMemberNumber || ''} 
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
               checked={formData.isLifeMember || false} 
               onChange={handleChange} 
               style={{width:'18px', height:'18px', cursor: 'not-allowed'}} 
               disabled 
               title="Life membership is assigned by admin"
             />
             <label style={{fontWeight:'bold', fontSize:'0.85rem', color: '#94a3b8'}}>Life Member</label>
          </div>

          <div style={{gridColumn:'span 2'}}>
            <label style={s.label}>Office Address</label>
            <textarea name="officeAddress" value={formData.officeAddress || ''} onChange={handleChange} style={s.textarea} />
          </div>
          <div style={{gridColumn:'span 2'}}>
            <label style={s.label}>Residence Address</label>
            <textarea name="residenceAddress" value={formData.residenceAddress || ''} onChange={handleChange} style={s.textarea} />
          </div>
        </div>

        {/* SECTION 5: PROFILE PICTURE */}
        <div style={s.section}>5. Profile Picture</div>
        <div style={{display:'flex', alignItems:'center', gap:'20px', marginTop:'10px'}}>
           
           {image ? (
             <img src={URL.createObjectURL(image)} alt="New Selection" style={{width:'70px', height:'70px', borderRadius:'50%', objectFit:'cover', border:'2px solid #cbd5e1'}} />
           ) : formData.profilePic ? (
             <img src={`${BACKEND_URL}${formData.profilePic}`} alt="Current" style={{width:'70px', height:'70px', borderRadius:'50%', objectFit:'cover', border:'2px solid #cbd5e1'}} />
           ) : null}

           <div style={{display:'flex', flexDirection:'column', gap:'5px'}}>
             <label style={{
                padding: '8px 16px', background: '#f8fafc', border: '1px solid #cbd5e1', 
                borderRadius: '8px', color: '#001f3f', fontWeight: 'bold', fontSize: '0.85rem', 
                cursor: 'pointer', textAlign: 'center', display: 'inline-block'
             }}>
                {formData.profilePic || image ? 'Choose New File' : 'Select Profile Picture'}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={e => setImage(e.target.files[0])} 
                  style={{ display: 'none' }} 
                />
             </label>
             <span style={{fontSize:'0.75rem', color:'#64748b'}}>
                {image ? image.name : (formData.profilePic ? 'Current photo saved' : 'No new file chosen')}
             </span>
           </div>

        </div>

        {/* ACTIONS */}
        <div style={s.footer}>
          <button type="button" onClick={handleDiscard} style={s.btnDiscard}>Discard Changes</button>
          <button type="submit" disabled={saving} style={s.btnSave}>
            {saving ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};

const s = {
  container: { maxWidth: '850px', margin: '20px auto', padding: '30px', background: '#fff', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  mainTitle: { color: '#001f3f', borderBottom: '3px solid #fbbf24', paddingBottom: '10px', marginBottom: '25px' },
  section: { fontWeight: 'bold', marginTop: '30px', marginBottom: '15px', color: '#001f3f', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid #eee', paddingBottom: '5px' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' },
  input: { padding: '12px', borderRadius: '8px', border: '1px solid #ddd', width: '100%', boxSizing: 'border-box', fontSize: '0.95rem', backgroundColor: '#fff' },
  textarea: { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', height: '80px', boxSizing: 'border-box', fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical' },
  label: { fontSize: '0.75rem', fontWeight: 'bold', color: '#64748b', marginBottom: '5px', display: 'block', textTransform: 'uppercase' },
  field: { display: 'flex', flexDirection: 'column' },
  footer: { display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '40px', borderTop: '2px solid #eee', paddingTop: '20px' },
  btnSave: { flex: 2, padding: '16px', background: '#001f3f', color: '#fbbf24', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: '0.3s' },
  btnDiscard: { flex: 1, padding: '16px', background: '#f8fafc', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '12px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', transition: '0.3s' }
};

export default ProfileEdit;