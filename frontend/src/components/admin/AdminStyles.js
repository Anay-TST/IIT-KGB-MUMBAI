import styled from "styled-components";

// 1. Define the individual styled components
export const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f4f7fe;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

export const Sidebar = styled.div`
  width: 250px;
  background: #2d3436;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 5px rgba(0,0,0,0.1);

  h2 {
    font-size: 1.2rem;
    margin-bottom: 2rem;
    color: #00cec9;
    text-align: center;
  }

  li {
    padding: 12px 15px;
    border-radius: 8px;
    margin-bottom: 5px;
    transition: all 0.3s ease;
    cursor: pointer;

    &:hover {
      background: #636e72;
    }
  }
`;

export const MainContent = styled.div`
  flex: 1;
  padding: 40px;
  overflow-y: auto;

  h1 {
    margin-bottom: 30px;
    color: #2d3436;
    font-weight: 700;
  }
`;

export const StatCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  min-width: 240px;
  border: 1px solid #e1e8ed;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-5px);
  }

  h3 {
    margin: 0;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #636e72;
  }

  p {
    font-size: 2rem;
    font-weight: 800;
    margin: 10px 0 0 0;
    color: #0984e3;
  }
`;

// 2. Wrap them in an object for the default export
// This allows you to use AdminStyles.AdminContainer in other files
const AdminStyles = {
  AdminContainer,
  Sidebar,
  MainContent,
  StatCard,
};

export default AdminStyles;