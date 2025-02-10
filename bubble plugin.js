const properties = {
    bubble: {
        resizable: true,
        responsive: true,
        background: true,
        borders: true,
        padding: true,
        boxShadow: true,
        fontStyle: true,
        fitWidthToContent: true,
        fitHeightToContent: true,
        supportHoveredPressedStates: true,
        supportStandardVisible: true,
        supportLargeFiles: true,
        supportAutobinding: true,
    }
};

// console.log("Bubble Properties (Checked Values):", properties);

// // Accessing the actual properties object from Bubble
// const bubbleProperties = context.properties.bubble;

// // Applying the properties to the instance.canvas if they exist
// if (bubbleProperties.background && properties.background) {
//     instance.canvas.style.background = bubbleProperties.background;
// }
// if (bubbleProperties.borders && properties.borders) {
//     instance.canvas.style.border = bubbleProperties.borders;
// }
// if (bubbleProperties.padding && properties.padding) {
//     instance.canvas.style.padding = bubbleProperties.padding;
// }
// if (bubbleProperties.boxShadow && properties.boxShadow) {
//     instance.canvas.style.boxShadow = bubbleProperties.boxShadow;
// }
// if (bubbleProperties.fontStyle && properties.fontStyle) {
//     instance.canvas.style.fontFamily = bubbleProperties.fontStyle;
// }

// // Handling visibility
// if (bubbleProperties.supportStandardVisible !== undefined && properties.supportStandardVisible) {
//     instance.canvas.style.display = bubbleProperties.supportStandardVisible ? "block" : "none";
// }



// Element code
// You can type here the code to build your element. You'll need to define 2 functions for the element itself initialize and update and a function for each action. This code will be interpreted as JS functions on the page.
// Headers to be applied to pages using this element (useful to add some open source JS files or some CSS)
function ElementCode(instance, context) { }

//Function initialize(): this is called once per instance of the element when the element gets visible on the page.
function Initialize(instance, context) {

    const editorID = `editor_${instance.instanceId || Math.random().toString(36).substr(2, 9)}`;
    const textarea = document.createElement("textarea");
    textarea.id = editorID;
    instance.canvas[0].appendChild(textarea);

    if (typeof tinymce === "undefined") {
        console.error("TinyMCE not loaded!");
        return;
    }

    tinymce.init({
        menubar: false, // Hide top menu bar
        selector: "textarea",
        plugins: [
            // Core editing features
            "lists",
            "link",
            "image",
            "emoticons",
            "table",
            "searchreplace",
            // Your account includes a free trial of TinyMCE premium features
            // Try the most popular premium features until Feb 11, 2025:
            "checklist",
            "advcode",
            "preview",
            "emoticons",
            "codesample",
            "fullscreen",
        ],
        toolbar1: "btnNewTemplate btnPreDefinedTemplates",
        toolbar2: "preview emoticons | undo redo | blocks | bold italic moreFormatting | textAlignment | forecolor backcolor | bullist numlist outdent indent | checklist link image emoticons table quicktable | insertfile | insertElements | fullscreen | btnSaveTeamplate btnSaveAs",
        // mobile: {'preview emoticons',},
        // mobile: {
        //   plugins: 'preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate',
        // },
        // plugins: 'importword exportword exportpdf preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown',
        // toolbar2: "undo redo | importword exportword exportpdf | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table math media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview", 
        // Note: if a toolbar item requires a plugin, the item will not present in the toolbar if the plugin is not also loaded.

        setup: (editor) => {
            editor.ui.registry.addMenuButton('btnPreDefinedTemplates', {
                text: 'PreDefined Templates',
                fetch: (callback) => {
                    // Fetch data from the API
                    fetch('https://html-editor---confluence.bubbleapps.io/version-test/api/1.1/obj/Predefined_Templates', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer a2859827f2ea40a3c89a29886ce08cf0`, // Add Bearer token
                            'Content-Type': 'application/json'
                        }
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            // Map the API results to menu items
                            const items = data.response.results.map(item => ({
                                type: 'menuitem',
                                text: item.Name, // Use the "Name" field as the menu item text
                                onAction: () => {
                                    editor.setContent(item.Content); // Use the "Content" field to set the editor content
                                }
                            }));
                            callback(items); // Pass the dynamically created menu items to the callback
                        })
                        .catch(error => {
                            console.error('Error fetching templates:', error);
                            callback([]); // Return an empty array in case of an error
                        });
                }
            });
            editor.ui.registry.addButton("btnNewTemplate", {
                text: "New Template",
                onAction: (_) =>
                    editor.insertContent(`&nbsp;<strong>New Tempalte</strong>&nbsp;`),
            });
            editor.ui.registry.addButton("btnSaveTeamplate", {
                text: "Save Teamplate",
                tooltip: "Save this teamplate",
                onAction: (_) =>
                    editor.setContent(
                        `&nbsp;<strong>Save this teamplate</strong>&nbsp;`
                    ),
            });
            editor.ui.registry.addButton("btnSaveAs", {
                text: "Save As",
                tooltip: "Save this teamplate as new Teamplate",
                onAction: (_) =>
                    editor.insertContent(
                        `&nbsp;<strong>Save this teamplate as new Teamplate</strong>&nbsp;`
                    ),
            });
        },
        toolbar_groups: {
            moreFormatting: {
                icon: "image-options",
                tooltip: "More formatting",
                items: "underline strikethrough code subscript superscript removeformat codesample",
            },
            textAlignment: {
                icon: "accordion",
                tooltip: "Text alignment",
                items: "alignleft aligncenter alignright",
            },
            insertElements: {
                icon: "addtag",
                tooltip: "Insert elements / ",
                items: "searchreplace",
            },
        },
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }",
    });

}

// Function update: this is called whenever a field or a field value changes.
function Update(instance, properties, context) { }

// Function preview: this is used to render a preview of your element in the editor.Arguments are simplified versions of the arguments to update.
function Preview(instance, properties) { }

// Add a reset function to wipe the content of the element on Reset actions(for inputs)
// Function reset: this is called whenever a 'Reset relevant inputs' or 'Reset Group' action runs on this element
function Reset(instance, properties) { }

// Function initializeState_value: this is called whenever the element is created.It should return the initial value of the state.
function initializeState_value(properties, context) { }