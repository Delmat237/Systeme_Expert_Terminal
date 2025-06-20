interface Module {
  id: string;
  name: string;
  description: string;
  module_features : String[];
}

interface ModuleSelectorProps {
  modules: Module[];
  activeModule: string;
  onChange: (module: string) => void;
}

export default function ModuleSelector({ modules, activeModule, onChange }: ModuleSelectorProps) {
  return (

      <div className=" container mx-auto px-4 py-8">
      <h2 className="text-lg font-semibold mb-4">📋 Modules du Système Expert</h2>
        <p className="section-subtitle">Six modules interconnectés pour une gestion logistique complète</p>

        {modules.map((module) => (
            <div className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-16 modules-grid ">
          <div 
            key={module.id}
            onClick={() => onChange(module.id)}
            className={`module-card p-3 rounded cursor-pointer transition-colors ${
              activeModule === module.id 
                ? 'bg-blue-100 border-l-4 border-blue-600' 
                : 'hover:bg-gray-100'
            }`}
          >
            <div className="module-icon">{module.id}</div>
            <h3 className="text-xl font-bold text-white mb-4">{module.name}</h3>
            <p className="text-gray-100 mb-6">{module.description}</p>
 
               <div className="module-features">
                {module.module_features.map((feature, index) => (
                    <span 
                      key={index}
                      className="feature-tag"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
          </div>
            </div>
        ))}
    
    </div>
 
  );
}