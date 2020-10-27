import React from 'react';

interface Props {
    className?: string,
    onBlur: () => void
}

const OnBlurComponent = function (props: React.PropsWithChildren<Props>) {
    const handleBlur = (e) => {
        const currentTarget = e.currentTarget;

        // Check the newly focused element in the next tick of the event loop
        setTimeout(() => {
            // Check if the new activeElement is a child of the original container
            if (!currentTarget.contains(document.activeElement)) {
                // You can invoke a callback or add custom logic here
                props.onBlur();
            }
        }, 0);
    };

    return (
        <div tabIndex={1} onBlur={handleBlur} className={props.className}>
            {props.children}
        </div>
    );
}

export default OnBlurComponent;