"use client";


import Footer from "@/app/components/Footer";
import Header from "@/app/components/Header";
import React, { useEffect, useState } from 'react';
import { User, ChevronDown, ChevronRight, Calendar, CreditCard, Heart, Users } from 'lucide-react';
import { API_ENDPOINTS } from '../components/Utils/apis';
import API from '../components/Utils/apis';

const FamilyMembers = ({ rootProfileId = null }) => {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [showAllDetails, setShowAllDetails] = useState(false);

  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchFamilyTree = async () => {
          try {
              setLoading(true);
              const url = rootProfileId
                  ? `${API_ENDPOINTS.GET_FAMILY_TREE}${rootProfileId}/`
                  : API_ENDPOINTS.GET_FAMILY_TREE;

              const response = await API.get(url);
              setTreeData(response.data);
              setLoading(false);
          } catch (err) {
              setError('Failed to load family tree data');
              setLoading(false);
              console.error(err);
          }
      };

      fetchFamilyTree();
  }, [rootProfileId]);

  const toggleNode = (id, e) => {
      e.stopPropagation();
      setExpandedNodes(prev => ({
          ...prev,
          [id]: !prev[id]
      }));
  };

  const toggleAllDetails = () => {
      setShowAllDetails(!showAllDetails);
  };

  const renderPersonCard = (person, isExpandable = false) => {
      const isExpanded = expandedNodes[person.id];
      const isMale = person.gender === 'Male';

      return (
          <div
              className={`person-card ${isMale ? 'male' : 'female'}`}
              key={person.id}
          >
              <div className="person-header">
                  <div className="person-identity">
                      <div className={`person-avatar ${isMale ? 'male-avatar' : 'female-avatar'}`}>
                          <User size={16} />
                      </div>
                      <div className="person-name">{person.name}</div>
                  </div>
                  {isExpandable && person.children && person.children.length > 0 && (
                      <button
                          onClick={(e) => toggleNode(person.id, e)}
                          className="expand-button"
                      >
                          {isExpanded ?
                              <ChevronDown size={18} /> :
                              <ChevronRight size={18} />
                          }
                      </button>
                  )}
              </div>

              {(isExpanded || showAllDetails) && (
                  <div className="person-details">
                      {person.birth_date && (
                          <div className="detail-item">
                              <Calendar size={14} />
                              <span>{person.birth_date}</span>
                          </div>
                      )}
                      {person.mykad && (
                          <div className="detail-item">
                              <CreditCard size={14} />
                              <span>{person.mykad}</span>
                          </div>
                      )}
                  </div>
              )}
          </div>
      );
  };

  const renderMarriageConnector = () => {
      return (
          <div className="marriage-connector">
              <div className="connector-line"></div>
              <div className="connector-heart">
                  <Heart size={14} />
              </div>
          </div>
      );
  };

  const renderMarriages = (person) => {
      if (!person.spouses || person.spouses.length === 0) {
          return <div className="children-container">{renderChildren(person, null)}</div>;
      }

      return (
          <div className="marriages-container">
              {person.spouses.map(spouse => (
                  <div key={spouse.id} className="marriage-unit">
                      <div className="couple-container">
                          <div className="spouse-card">
                              {renderPersonCard(person, true)}
                          </div>
                          {renderMarriageConnector()}
                          <div className="spouse-card">
                              {renderPersonCard(spouse)}
                          </div>
                      </div>
                      {renderChildren(person, spouse)}
                  </div>
              ))}
          </div>
      );
  };

  const renderChildrenCounter = (count) => {
      return (
          <div className="children-counter">
              <div className="counter-badge">
                  <Users size={14} />
                  {count} {count === 1 ? 'child' : 'children'}
              </div>
          </div>
      );
  };

  const renderChildren = (parent, spouse) => {
      // Filter children based on both parents
      const filteredChildren = parent.children.filter(child => {
          if (!spouse) return true;
          return child.parents.some(p => p.id === spouse.id);
      });

      if (filteredChildren.length === 0) {
          return null;
      }

      const isExpanded = expandedNodes[parent.id];
      if (!isExpanded && !showAllDetails) {
          return renderChildrenCounter(filteredChildren.length);
      }

      return (
          <div className="children-tree">
              <div className="vertical-line"></div>
              {filteredChildren.map((child, index) => (
                  <div key={child.id} className="child-branch">
                      <div className="horizontal-line"></div>
                      <div className="child-content">
                          <div className="child-card">
                              {renderPersonCard(child, true)}
                          </div>
                          {(expandedNodes[child.id] || showAllDetails) && child.spouses && child.spouses.length > 0 && (
                              <div className="child-marriages">
                                  {renderMarriages(child)}
                              </div>
                          )}
                      </div>
                  </div>
              ))}
          </div>
      );
  };

  const renderParents = (person) => {
      if (!person.parents || person.parents.length < 2) return null;

      const father = person.parents.find(p => p.gender === 'Male');
      const mother = person.parents.find(p => p.gender === 'Female');

      if (!father || !mother) return null;

      return (
          <div className="parents-container">
              <div className="couple-container">
                  <div className="spouse-card">
                      {renderPersonCard(father)}
                  </div>
                  {renderMarriageConnector()}
                  <div className="spouse-card">
                      {renderPersonCard(mother)}
                  </div>
              </div>
              <div className="parent-child-connector">
                  <div className="connector-vertical"></div>
              </div>
          </div>
      );
  };

  const renderSiblings = (person) => {
      if (!person.siblings || person.siblings.length === 0) return null;

      return (
          <div className="siblings-container">
              <div className="siblings-header">
                  <Users size={18} />
                  <h3>Siblings</h3>
                  <span className="siblings-count">
                      {person.siblings.length}
                  </span>
              </div>
              <div className="siblings-grid">
                  {person.siblings.map(sibling => (
                      <div key={sibling.id} className="sibling-card">
                          {renderPersonCard(sibling)}
                      </div>
                  ))}
              </div>
          </div>
      );
  };

  const renderTree = (person) => {
      return (
          <div className="family-tree-container">
              {renderParents(person)}
              <div className="main-person">
                  {renderPersonCard(person, true)}
              </div>
              {renderSiblings(person)}
              {renderMarriages(person)}
          </div>
      );
  };

  if (loading) return (
      <div className='loading-container'>
          <div className='loading-spinner'></div>
          <p>Loading family tree...</p>
      </div>
  );
  
  
  if (error) return <div className='error-container'><div className='error-icon'>⚠️</div>{error}</div>;
  if (!treeData) return <div className='no-data-container'><div className='no-data-icon'>📂</div>No family data available</div>;



  return (
    <div className="bg-gray-100">
      {/* Hero Section */}
      <div className="text-white text-center inner-banner">
        <Header />
        <div className="flex justify-center items-center">
          <h1 className="text-2xl md:text-5xl font-bold shadow-md">
            FAMILY MEMBERS
          </h1>
        </div>
      </div>
      <div className="family-tree-wrapper">
            <div className="tree-header">
                <div className="header-content">
                    <h1>Family Tree</h1>
                    <button
                        onClick={toggleAllDetails}
                        className={`details-toggle ${showAllDetails ? 'active' : ''}`}
                    >
                        {showAllDetails ? 'Hide Details' : 'Show All Details'}
                    </button>
                </div>
            </div>
            <div className="tree-body">
                <div className="tree-content">
                    {renderTree(treeData)}
                </div>
            </div>
        </div>
     
      <Footer />
    </div>
  );
};

export default FamilyMembers;
