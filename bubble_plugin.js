// Instance (Manages Plugin Behavior)
const instance = {
    canvas: [document.getElementById("editor-container")],
    publishState: (key, value) => console.log(`State Published: ${key} = ${value}`),
    triggerEvent: (eventName, data) => console.log(`Event Triggered: ${eventName}`, data),
    data: {
        editorID: `editor_${Math.random().toString(36).substr(2, 9)}`, // Unique ID for TinyMCE
        someOtherData: null // Placeholder for custom data storage
    },
    instanceId: "unique-instance-12345", // Bubble assigns a unique ID
    width: 500, // Example width of the plugin element
    height: 300, // Example height of the plugin element
};

// Context (Handles Global Bubble Data)
const context = {
    async: true, // Simulates async capabilities
    getHeader: () => ({ Authorization: "Bearer some_token" }), // Simulating API headers
    uploadContent: (fileData, callback) => {
        console.log("Uploading file:", fileData);
        callback("https://uploaded.file.url");
    },
    getData: (key) => {
        console.log(`Fetching data for key: ${key}`);
        return "Some stored value";
    },
};

// Properties (Stores Bubble User-Defined Inputs)
const properties = {
    initial_content: "<p>Default editor content</p>", // Initial text for TinyMCE
    read_only: false, // Determines if the editor is read-only
    predefined_templates: {
        length: () => 3, // Simulating a list with 3 items
        get: (start, end) => [
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Software Development",
                        _api_c2_body: "<ac:structured-macro ac:name=\"panel\" ac:schema-version=\"1\" ac:macro-id=\"bc82cb0f-6564-4928-a24c-f325fc29da0f\"/>",
                        _api_c2_status: "current"
                    };
                    return data[field] || null;
                }
            },
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Retrospective Meeting",
                        _api_c2_body: "value will be visible here",
                        _api_c2_status: "archived"
                    };
                    return data[field] || null;
                }
            },
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Sprint Planning Meeting",
                        _api_c2_body: "kjklajdlkasj lkasjd lsakjd value will be visible here",
                        _api_c2_status: "current"
                    };
                    return data[field] || null;
                }
            }
        ].slice(start, end)
    },
    // Define `names_space` as a Bubble list
    my_spaces: {
        length: () => 3, // Simulating a list with 3 items
        get: (start, end) => [
            { get: (field) => (field === "_api_c2_name" ? "Software Development" : null) },
            { get: (field) => (field === "_api_c2_name" ? "Knowledge Base" : null) },
            { get: (field) => (field === "_api_c2_name" ? "Predefined Templates" : null) }
        ].slice(start, end)
    },
    my_templates: {
        length: () => 3, // Simulating a list with 3 items
        get: (start, end) => [
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Software Development",
                        _api_c2_body: "<ac:structured-macro ac:name=\"panel\" ac:schema-version=\"1\" ac:macro-id=\"bc82cb0f-6564-4928-a24c-f325fc29da0f\"/>",
                        _api_c2_status: "current"
                    };
                    return data[field] || null;
                }
            },
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Retrospective Meeting",
                        _api_c2_body: "value will be visible here",
                        _api_c2_status: "archived"
                    };
                    return data[field] || null;
                }
            },
            {
                get: (field) => {
                    const data = {
                        _api_c2_title: "Sprint Planning Meeting",
                        _api_c2_body: "kjklajdlkasj lkasjd lsakjd value will be visible here",
                        _api_c2_status: "current"
                    };
                    return data[field] || null;
                }
            }
        ].slice(start, end)
    },
    editor_content: "<p>Sample content</p>", // Example editor content
};

// Bubble.io **Exposed States** (Dynamic Values)
const exposedStates = {
    editor_content: properties.initial_content, // Stores the editor’s current content
    selected_predefined_template_id: "", // Stores the selected Predefined_Template ID
    selected_my_space_id: "", // Stores the selected My_Space ID 

};

// Bubble.io **Events**
const events = {
    btnsavetemplate_is_clicked: () => instance.triggerEvent("btnsavetemplate_is_clicked", {}),
    btnsaveas_is_clicked: () => instance.triggerEvent("btnsaveas_is_clicked", {}),
};

// Element code
// You can type here the code to build your element. You'll need to define 2 functions for the element itself initialize and update and a function for each action. This code will be interpreted as JS functions on the page.
// Headers to be applied to pages using this element (useful to add some open source JS files or some CSS)
function ElementCode(instance, context) { }

//Function initialize(): this is called once per instance of the element when the element gets visible on the page.
function Initialize(instance, context) {

    // Generate unique editor ID
    instance.data.editorID = `editor_${instance.instanceId || Math.random().toString(36).substr(2, 9)}`;

    // Create textarea for TinyMCE
    const textarea = document.createElement("textarea");
    textarea.id = instance.data.editorID;

    // Append textarea to the canvas
    instance.canvas[0].appendChild(textarea);

    console.log("Textarea created with ID:", instance.data.editorID);

}

// Function update: this is called whenever a field or a field value changes.
function Update(instance, properties, context) {

    // Function to convert JSON-safe string to a normal string
    function jsonSafeToNormalString(jsonSafeString) {
        return jsonSafeString
            .replace(/\\"/g, '"') // Unescape double quotes
            .replace(/\\\\/g, '\\') // Unescape backslashes
            .replace(/\\b/g, '\b') // Backspace
            .replace(/\\f/g, '\f') // Form feed
            .replace(/\\n/g, '\n') // Newline
            .replace(/\\r/g, '\r') // Carriage return
            .replace(/\\t/g, '\t') // Tab
            .replace(/\\u([0-9a-fA-F]{4})/g, (_, hex) => String.fromCharCode(parseInt(hex, 16))); // Unicode
    }

    //  * Extracts values from a Bubble "anything with value" type field based on a specified property.
    //  * @param {Object} data - The Bubble "anything with value" type field.
    //  * @param {string} property - The property to extract values from.
    //  * @returns {Array} - A list of values for the specified property.

    function extractValuesFromBubbleData(data, property) {
        // Ensure data is valid and has the get method
        if (!data || typeof data.get !== "function") {
            console.error("extractValuesFromBubbleData: Invalid data provided");
            return [];
        }

        // Extract the list from the Bubble "anything with value" type
        const dataList = data.get(0, data.length()) || [];
        // console.log("extractValuesFromBubbleData: Raw data list:", dataList); // Debugging

        // Ensure `_api_c2_` is prefixed
        const prefixedProperty = `_api_c2_${property}`;

        // Extract values for the specified property
        const values = dataList.map(item => {
            if (item && typeof item.get === "function") {
                return item.get(prefixedProperty);
            }
            return null; // Return null for invalid items
        }).filter(value => value !== null); // Filter out null values

        // console.log(`extractValuesFromBubbleData: Extracted values for property "${property}":`, values);
        return values;
    }

    function validateExtractedData(length1, length2) {
        if (length1 === 0 || length2 === 0) {
            console.error('Invalid or missing data');
            return true; // Returning true to indicate an error
        }
        return false;
    }

    function resetExposedStates() {
        instance.publishState("editor_content", "");
        instance.publishState("selected_predefined_template_id", "");
        instance.publishState("selected_my_space_id", "");
    }

    if (typeof tinymce === "undefined") {
        console.error("TinyMCE not loaded!");
        return;
    }

    const editorID = instance.data.editorID;

    // Destroy previous instance if it exists
    if (tinymce.get(editorID)) {
        tinymce.get(editorID).remove();
    }

    tinymce.init({
        menubar: false, // Hide top menu bar
        selector: `#${editorID}`,
        // selector: "textarea",
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
        toolbar1: "btnNewTemplate ddlPreDefinedTemplates",
        toolbar2: "ddlMySpaces ddlMyTemplates | btnSaveTemplate | btnSaveAs",
        toolbar3: "preview emoticons | undo redo | blocks | bold italic moreFormatting | textAlignment | forecolor backcolor | bullist numlist outdent indent | checklist link image emoticons table quicktable | insertfile | insertElements | fullscreen",
        // mobile: {'preview emoticons',},
        // mobile: {
        //   plugins: 'preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker help formatpainter pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate',
        // },
        // plugins: 'importword exportword exportpdf preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save directionality advcode visualblocks visualchars fullscreen image link math media mediaembed codesample table charmap pagebreak nonbreaking anchor tableofcontents insertdatetime advlist lists checklist wordcount tinymcespellchecker a11ychecker editimage help formatpainter permanentpen pageembed charmap mentions quickbars linkchecker emoticons advtable footnotes mergetags autocorrect typography advtemplate markdown',
        // toolbar2: "undo redo | importword exportword exportpdf | aidialog aishortcuts | blocks fontsizeinput | bold italic | align numlist bullist | link image | table math media pageembed | lineheight  outdent indent | strikethrough forecolor backcolor formatpainter removeformat | charmap emoticons checklist | code fullscreen preview", 
        // Note: if a toolbar item requires a plugin, the item will not present in the toolbar if the plugin is not also loaded.

        setup: (editor) => {
            editor.setContent(properties.initial_content);

            editor.on('change', () => {
                instance.publishState("editor_content", editor.getContent());
            });

            // Custom Buttons
            editor.ui.registry.addButton("btnNewTemplate", {
                text: "New Template",
                tooltip: "Create a new template",
                enabled: true, // button is active when the dialog opens
                onAction: () => {
                    resetExposedStates();
                    editor.insertContent("");
                }
            });

            // Predefined Templates DropDown List
            editor.ui.registry.addMenuButton('ddlPreDefinedTemplates', {
                text: 'PreDefined Templates',
                height: 300,
                width: "100%",
                enabled: true, // button is active when the dialog opens
                fetch: (callback) => {
                    try {
                        // // Extract list from Bubble's "anything" type with list of value
                        // const predefinetemplates_list = properties.predefined_templates ? properties.predefined_templates.get(0, properties.predefined_templates.length()) : [];
                        // console.log("Raw predefined_templates_list:", predefinetemplates_list); // Debugging

                        // // Extract the first item (it should contain "results" if structured correctly)
                        // const firstItem = predefinetemplates_list[0];
                        // // console.log("the first item:", firstItem) // Debugging
                        // console.log("Available fields in firstItem:", firstItem.listProperties ? firstItem.listProperties() : "No properties found");

                        // // Extract all names using the correct field key
                        // const titles_pt = predefinetemplates_list.map(item => item.get("_api_c2_title"));
                        // console.log("Extracted Titles:", titles_pt);
                        // const bodies_pt = predefinetemplates_list.map(item => item.get("_api_c2_body.storage.value"));
                        // console.log("Extracted Bodies:", bodies_pt);

                        // Extract list from Bubble's "anything" type with list of value
                        const pt = properties.predefined_templates;
                        const titles_pt = extractValuesFromBubbleData(pt, "title");
                        const bodies_pt = extractValuesFromBubbleData(pt, "body.storage.value");
                        const ids_pt = extractValuesFromBubbleData(pt, "id");

                        if (validateExtractedData(titles_pt.length, bodies_pt.length)) {
                            callback([]);
                            return;
                        }

                        // Ensure both lists have the same length
                        const length = Math.min(titles_pt.length, bodies_pt.length);

                        const items = Array.from({
                            length
                        }, (_, i) => ({
                            type: 'menuitem',
                            text: titles_pt[i], // Dropdown text
                            onAction: () => {
                                const normalString = jsonSafeToNormalString(bodies_pt[i]); // Convert to normal string
                                editor.setContent(normalString); // Set the cleaned content
                                instance.publishState("selected_predefined_template_id", ids_pt[i]);
                            }
                        }));

                        callback(items);
                    } catch (error) {
                        console.error('Error processing template data:', error);
                        callback([]);
                    }
                }
            });

            // Predefined Templates DropDown List
            editor.ui.registry.addMenuButton('ddlMySpaces', {
                text: 'My Space\'s',
                height: 300,
                width: "100%",
                enabled: true, // button is active when the dialog opens
                fetch: (callback) => {
                    try {
                        // Extract list from Bubble's "anything" type with list of value
                        const ms = properties.my_spaces;
                        const names_ms = extractValuesFromBubbleData(ms, "name");
                        const ids_ms = extractValuesFromBubbleData(ms, "id");

                        if (validateExtractedData(names_ms.length, ids_ms.length)) {
                            callback([]);
                            return;
                        }

                        // Ensure both lists have the same length
                        const length = Math.min(names_ms.length, ids_ms.length);

                        const items = Array.from({
                            length
                        }, (_, i) => ({
                            type: 'menuitem',
                            text: names_ms[i], // Dropdown text
                            onAction: () => {
                                instance.publishState("selected_my_space_id", ids_ms[i]);
                            }
                        }));

                        callback(items);
                    } catch (error) {
                        console.error('Error processing template data:', error);
                        callback([]);
                    }
                }
            });

            // Predefined Templates DropDown List
            editor.ui.registry.addMenuButton('ddlMyTemplates', {
                text: 'My Templates',
                height: 300,
                width: "100%",
                enabled: true, // button is active when the dialog opens
                fetch: (callback) => {
                    try {

                        // Extract list from Bubble's "anything" type with list of value
                        const mt = properties.my_templates;
                        const titles_mt = extractValuesFromBubbleData(mt, "title");
                        const bodies_mt = extractValuesFromBubbleData(mt, "body.storage.value");
                        const ids_mt = extractValuesFromBubbleData(mt, "id");

                        if (validateExtractedData(titles_mt.length, bodies_mt.length)) {
                            callback([]);
                            return;
                        }

                        // Ensure both lists have the same length
                        const length = Math.min(titles_mt.length, bodies_mt.length);
                        const items = Array.from({
                            length
                        }, (_, i) => ({
                            type: 'menuitem',
                            text: titles_mt[i], // Dropdown text
                            onAction: () => {
                                const normalString = jsonSafeToNormalString(bodies_mt[i]); // Convert to normal string
                                editor.setContent(normalString); // Set the cleaned content
                                instance.publishState("selected_predefined_template_id", ids_mt[i]);
                            }
                        }));

                        callback(items);
                    } catch (error) {
                        console.error('Error processing template data:', error);
                        callback([]);
                    }
                }
            });

            editor.ui.registry.addButton("btnSaveTemplate", {
                text: "Save Template",
                tooltip: "Save this template",
                height: 300,
                width: "100%",
                enabled: true, // button is active when the dialog opens
                onAction: () => {
                    editor.ui.registry.getAll().buttons.btnnewtemplate.enabled = false;
                    editor.ui.registry.getAll().buttons.ddlmyspaces.enabled = false;
                    instance.triggerEvent("btnsavetemplate_is_clicked", {});
                }
            });

            editor.ui.registry.addButton("btnSaveAs", {
                text: "Save As",
                tooltip: "Save this template as new Template",
                onAction: () => {
                    console.log("btnsaveas_is_clicked event triggered");
                    instance.triggerEvent("btnsaveas_is_clicked", {});
                }
            });
        },
        content_style: "body { font-family:Helvetica,Arial,sans-serif; font-size:16px }"
    });

    console.log("TinyMCE initialized on", `#${editorID}`);
}

// Function preview: this is used to render a preview of your element in the editor.Arguments are simplified versions of the arguments to update.
function Preview(instance, properties) {
    var div = instance.canvas[0];

    // Apply styles correctly
    div.style.backgroundColor = "#F7F7F7";
    div.style.border = "1px solid #ddd";
    div.style.padding = "10px";

    // Insert container on the page
    div.innerHTML = '<div>TinyMCE Editor Preview</div>';
}

// Add a reset function to wipe the content of the element on Reset actions(for inputs)
// Function reset: this is called whenever a 'Reset relevant inputs' or 'Reset Group' action runs on this element
function Reset(instance, properties) {
    const editor = tinymce.get(instance.data.editorID);
    if (editor) {
        editor.setContent("");
    }
}

// Function initializeState_EditorContent: this is called whenever the element is created.It should return the initial value of the state.
function initializeState_EditorContent(properties, context) {
    return properties.initial_content || "";
}

// Initialize and Update the editor when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
    Initialize(instance, {});
    Update(instance, properties, {});
});