import React from 'react';

interface MapProps {
    className?: string;
}

const Map: React.FC<MapProps> = ({ className = "" }) => {
    return (
        <div className={`rounded-3xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700 ${className}`}>
            <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3477.378909157426!2d47.9774!3d29.3759!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3fcf84ba7b355555%3A0x7f005c0000000000!2sKuwait%20City%2C%20Kuwait!5e0!3m2!1sen!2skw!4v1625000000000!5m2!1sen!2skw"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: '300px' }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
                className="w-full h-full"
            ></iframe>
        </div>
    );
};

export default Map;
